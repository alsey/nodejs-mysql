const _ = require('lodash')
const mysql = require('mysql')
const expect = require('chai').expect
const target = require('..').default

describe('MySQL', function() {

	describe('#constructor()', function() {

		it('single database connection', function() {
			
			const config = {
				host: '192.168.0.100',
				port: 3306,
				user: 'root',
				password: 'password',
				database: 'testdb'
			}

			const createPoolStub = this.sandbox.stub(mysql, 'createPool', function(dbs) {
				return dbs
			})

			const result = new target(config)

			expect(createPoolStub).to.be.calledWith(config)
			expect(result).to.not.be.null
			expect(result.pool).to.deep.equal(config)
		})

		it('multiple database connections', function() {

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

			const createPoolClusterStub = this.sandbox.stub(mysql, 'createPoolCluster', function() {
				return {
					pool: [],
					add: function(obj) {
						this.pool.push(obj)
					}
				}
			})

			const result = new target(config)

			expect(createPoolClusterStub).to.be.calledWith()
			expect(result).to.not.be.null
			expect(result.pool.pool).to.deep.equal(config)		

		})

	})

	describe('#getInstance()', function() {

		it('only return one instance', function() {

			const config_1 = {
				host: '192.168.0.101',
				port: 3306,
				user: 'root',
				password: 'password',
				database: 'testdb'
			}

			const config_2 = {
				host: '192.168.0.102',
				port: 3306,
				user: 'root',
				password: 'password',
				database: 'testdb'
			}

			const createPoolStub = this.sandbox.stub(mysql, 'createPool', function(dbs) {
				return dbs
			})

			const result1 = target.getInstance(config_1)
			const result2 = target.getInstance(config_2)

			expect(result1).to.not.be.null
			expect(result2).to.not.be.null
			expect(result1).to.deep.equal(result2)	
			expect(result2.pool).to.deep.equal(config_1)
		})

	})	

	describe('#exec()', function() {

	})	
})
