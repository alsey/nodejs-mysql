/*
MIT License

Copyright (c) 2016 Alsey DAI (zamber@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
