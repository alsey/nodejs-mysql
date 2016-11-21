'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MySQL = function () {
    _createClass(MySQL, null, [{
        key: 'getInstance',
        value: function getInstance(dbs) {
            if (!this.instance) this.instance = new MySQL(dbs);
            return this.instance;
        }
    }]);

    function MySQL(dbs) {
        _classCallCheck(this, MySQL);

        if (Array.isArray(dbs)) {
            this.pool = _mysql2.default.createPoolCluster();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = dbs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var config = _step.value;

                    this.pool.add(config);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else {
            this.pool = _mysql2.default.createPool(dbs);
        }
    }

    _createClass(MySQL, [{
        key: 'exec',
        value: function exec(sql, params) {
            var _this = this;

            return new _bluebird2.default(function (resolve, reject) {
                _this.pool.getConnection(function (err, conn) {
                    if (err) {
                        console.error('database error!', err.stack ? err.stack : err);
                        if (conn) conn.release();
                        return reject(err);
                    }
                    conn.query(sql, params, function (err, rows) {
                        if (err) {
                            console.error('query error!', err.stack ? err.stack : err);
                            if (conn) conn.release();
                            return reject(err);
                        }
                        resolve(rows);
                    }).on('end', function () {
                        conn.commit(function (err) {
                            return console.error;
                        });
                        conn.release();
                    });
                });
            });
        }
    }, {
        key: 'ok',
        value: function ok(rows) {
            return new _bluebird2.default(function (resolve, reject) {
                return resolve(rows);
            });
        }
    }, {
        key: 'connect',
        value: function connect() {
            var _this2 = this;

            return new _bluebird2.default(function (resolve, reject) {
                _this2.pool.getConnection(function (err, conn) {
                    if (err) {
                        console.error('database error!', err.stack ? err.stack : err);
                        if (conn) conn.release();
                        return reject(err);
                    }
                    resolve(conn);
                });
            });
        }
    }, {
        key: 'trans',
        value: function trans(conn) {
            return new _bluebird2.default(function (resolve, reject) {
                conn.beginTransaction(function (err) {
                    if (err) {
                        console.error('start transaction error!', err.stack ? err.stack : err);
                        if (conn) conn.release();
                        return reject(err);
                    }
                    resolve(conn);
                });
            });
        }
    }, {
        key: 'query',
        value: function query(sql, params, conn) {
            return new _bluebird2.default(function (resolve, reject) {
                conn.query(sql, params, function (err, rows) {
                    if (err) {
                        console.error('query error!', err.stack ? err.stack : err);
                        if (conn) conn.rollback();
                        if (conn) conn.release();
                        return reject(err);
                    }
                    resolve(rows, conn);
                });
            });
        }
    }, {
        key: 'commit',
        value: function commit(conn) {
            return new _bluebird2.default(function (resolve, reject) {
                conn.commit(function (err) {
                    if (err) {
                        console.error('commit error!', err.stack ? err.stack : err);
                        if (conn) conn.rollback();
                        if (conn) conn.release();
                        return reject(err);
                    }
                });
            });
        }
    }]);

    return MySQL;
}();

exports.default = MySQL;