'use strict';

var mysql = require('..').default;

var database = {
	host: 'localhost',
	port: 10011,
	user: 'root',
	password: 'password',
	database: 'testdb'
};

var db = mysql.getInstance(database);

db.exec('select * from t1')
  .then(function(rows) {
  	for (var i = 0; i < rows.length; i++) {
  		console.log(rows[i]);
  	}
  })
  .catch(function(e) {
  	console.error(e);
  });
