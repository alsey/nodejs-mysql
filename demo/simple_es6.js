import mysql from '..'

const db = mysql.getInstance({
	host: 'localhost',
	port: 10011,
	user: 'root',
	password: 'password',
	database: 'testdb'
})

db.exec('select * from t1')
  .then(rows => rows.forEach(row => console.log(row)))
  .catch(e => console.error(e))
