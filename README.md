# nodejs-mysql

[![npm version](https://badge.fury.io/js/nodejs-mysql.svg)](https://badge.fury.io/js/nodejs-mysql) [![build status](https://travis-ci.org/alsey/nodejs-mysql.svg?branch=master)](https://travis-ci.org/alsey/nodejs-mysql) [![dependencies status](https://david-dm.org/alsey/nodejs-mysql.png)](https://david-dm.org/alsey/nodejs-mysql) [![Coverage Status](https://coveralls.io/repos/github/alsey/nodejs-mysql/badge.svg?branch=master)](https://coveralls.io/github/alsey/nodejs-mysql?branch=master)

[![NPM](https://nodei.co/npm/nodejs-mysql.png?compact=true)](https://nodei.co/npm/nodejs-mysql/)

The wrapper of Node.js MySQL driver with Promise enabled.

## Install

```javascript
$ npm install nodejs-mysql
```

# How to Use

**[Quick Start]**

The code style is this.

```javascript
import mysql from 'nodejs-mysql'

const db = mysql.getInstance(config)

db.exec('select col1, col2 from a_table')
		.then(rows => res.ok(rows))
		.catch(e => res.err(e)))
```

### 1. Database Connection Configuration

Use a config object to describe the database connection(s).

```javascript
// single database connection
const config = {
	host: '192.168.0.100',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'testdb'
}

// database connection pool
const config = [
	{
		host: '192.168.0.101',
		port: 3306,
		user: 'root',
		password: 'password',
		database: 'testdb',
		dateStrings: true,
		debug: false
	},{
		host: '192.168.0.102',
		port: 3306,
		user: 'root',
		password: 'password',
		database: 'testdb',
		dateStrings: true,
		debug: false
	},{
		host: '192.168.0.103',
		port: 3306,
		user: 'root',
		password: 'password',
		database: 'testdb',
		dateStrings: true,
		debug: false
	}
]
```

### 2. Get an Instance

Get an instance in anywhere before do database operation.

```javascript
import mysql from 'nodejs-mysql'

const db = mysql.getInstance(config)
```

### 3. Do Database Operation

One method for all database operation, NO need close database connection.

```javascript
// select
db.exec('select col1, col2 from a_table')
		.then(rows => {
			// do sth. with result in rows
		})
		.catch(e => {
			// handle errors
		})

// insert
db.exec('insert into a_table set ?', {
			col1: value1,
			col2: value2
		})
		.then(rows => {
			// no error, insert ok
		})
		.catch(e => {
			// insert failed, handle errors
		})
		
// update
db.exec('update a_table set col1 = ?, col2 = ?', [value1, value2])
		.then(rows => {
			// no error, update ok
		})
		.catch(e => {
			// update failed, handle errors
		})

// delete
db.exec('delete from a_table where col1 = ?', [value1])
		.then(rows => {
			// no error, delete ok
		})
		.catch(e => {
			// delete failed, handle errors
		})
```

### 4. Transaction

```javascript
db.connect()
  .then(conn => db.trans(conn))
  .then(conn => db.query(sql, params, conn))
  .then((rows, conn) => {
    // do sth. with the result in rows
    return db.query(sql2, params2, conn)
  })
  .then((rows, conn) => {
    // do sth. with the result2 in rows
    if (condition)
      return db.query(sql3, params3, conn)
    else
      return db.ok(rows) // <-- directly put result to next
  })
  .then((rows, conn) => {
    // do sth. with the result3 in rows
    return db.commit(conn)
  })
  .catch(e => {
    // handle errors
  })
```
