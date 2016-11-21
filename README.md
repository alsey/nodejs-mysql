# nodejs-mysql

  The wrapper of Node.js MySQL driver with Promise enabled.

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Test Coverage][coveralls-image]][coveralls-url]

[![NPM](https://nodei.co/npm/nodejs-mysql.png?compact=true)](https://nodei.co/npm/nodejs-mysql/)

```js
import mysql from 'nodejs-mysql'

const db = mysql.getInstance(config)

db.exec('select col1, col2 from a_table')
        .then(rows => res.ok(rows))
        .catch(e => res.err(e)))
```

## Installation

```bash
$ npm install nodejs-mysql
```

## Demo

Folder `demo` includes a simple demo of both [ES5](https://github.com/alsey/nodejs-mysql/blob/master/demo/simple_es5.js) and [ES6](https://github.com/alsey/nodejs-mysql/blob/master/demo/simple_es6.js). 

## How to Use

Use config object to describe database connection(s).

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

Get instance in anywhere before do database operations.

```javascript
import mysql from 'nodejs-mysql'

const db = mysql.getInstance(config)
```

**Attention** If you are not using ES6, import package like this,

```javascript
const mysql = require('nodejs-mysql').default;
```

Method `exec` for all database operation, close database connection is not need.

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

`nodejs-mysql` also support transaction. Transaction code like this,

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
## License

  [MIT](LICENSE)


[npm-image]: https://badge.fury.io/js/nodejs-mysql.svg
[npm-url]: https://npmjs.org/package/nodejs-mysql
[downloads-image]: https://img.shields.io/npm/dm/nodejs-mysql.svg
[downloads-url]: https://npmjs.org/package/nodejs-mysql
[travis-image]: https://img.shields.io/travis/alsey/nodejs-mysql/master.svg?label=linux
[travis-url]: https://travis-ci.org/alsey/nodejs-mysql
[appveyor-image]: https://img.shields.io/appveyor/ci/alsey/nodejs-mysql/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/alsey/nodejs-mysql
[coveralls-image]: https://img.shields.io/coveralls/alsey/nodejs-mysql/master.svg
[coveralls-url]: https://coveralls.io/r/alsey/nodejs-mysql?branch=master
