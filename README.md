# nodejs-mysql

The wrapper module of Node.js MySQL driver with Promise enabled.

## Install

```javascript
$ npm install nodejs-mysql
```

# How to Use

**[Quick Start]**

Let's take a look of the style using this module.

```javascript
import mysql from 'nodejs-mysql'

const db = mysql.getInstance(config)

db.exec('select col1, col2 from a_table')
		.then(rows => res.ok(rows))
		.catch(e => res.err(e)))
```

### 1. Database Connection Configuration

First, use a config object to describe the database connection(s).

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

Then, get an instance to make database operation.

```javascript
const db = mysql.getInstance(config)
```

This style lets client uses mysql driver in multiple files but only one instance.

### 3. Do Database Operation

In brief, one method for all database operation.

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

That's all , no need close database connection.

### 4. Transaction

Transaction style likes this.

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
