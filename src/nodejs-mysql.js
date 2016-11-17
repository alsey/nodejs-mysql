/*
Copyright 2016 Alsey (zamber@gmail.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import mysql from 'mysql'
import Promise from 'bluebird'

export default class MySQL {

	static getInstance(dbs) {
		if (!this.instance)
			this.instance = new MySQL(dbs)
		return this.instance
	}

	constructor(dbs) {
		if (Array.isArray(dbs)) {
			this.pool = mysql.createPoolCluster()
			for (let config of dbs)
				this.pool.add(config)
		} else {
			this.pool = mysql.createPool(dbs)
		}
	}

	exec(sql, params) {
		return new Promise((resolve, reject) => {
			this.pool.getConnection((err, conn) => {
				if (err) {
					console.error('database error!', err.stack ? err.stack : err)
					if (conn) conn.release()
					return reject(err)
				}
				conn.query(sql, params, (err, rows) => {
					if (err) {
						console.error('query error!', err.stack ? err.stack : err)
						if (conn) conn.release()
						return reject(err)
					}
					resolve(rows)
				}).on('end', () => {
					conn.commit((err) => console.error)
					conn.release()
				})
			})
		})
	}

	ok(rows) {
		return new Promise((resolve, reject) => resolve(rows))
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.pool.getConnection((err, conn) => {
				if (err) {
					console.error('database error!', err.stack ? err.stack : err)
					if (conn) conn.release()
					return reject(err)
				}
				resolve(conn)
			})
		})
	}

	trans(conn) {
		return new Promise((resolve, reject) => {
			conn.beginTransaction((err) => {
				if (err) {
					console.error('start transaction error!', err.stack ? err.stack : err)
					if (conn) conn.release()
					return reject(err)
				}
				resolve(conn)
			})
		})
	}

	query(sql, params, conn) {
		return new Promise((resolve, reject) => {
			conn.query(sql, params, (err, rows) => {
				if (err) {
					console.error('query error!', err.stack ? err.stack : err)
					if (conn) conn.rollback()
					if (conn) conn.release()
					return reject(err)
				}
				resolve(rows, conn)
			})
		})
	}

	commit(conn) {
		return new Promise((resolve, reject) => {
			conn.commit((err) => {
				if (err) {
					console.error('commit error!', err.stack ? err.stack : err)
					if (conn) conn.rollback()
					if (conn) conn.release()
					return reject(err)				
				}
			})
		})
	}
}
