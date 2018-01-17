var ConnectionPool = require('tedious-connection-pool');
//var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var poolConfig = {
    min: 2,
    max: 4,
    log: true
};

var config = {
  userName: 'AgileControllerDBA',
  password: 'Huawei@123',
  server: '192.168.163.25'
};

var pool = new ConnectionPool(poolConfig, config);
//var connection = new Connection(config);
pool.on('error', function(err){
  console.error(err);
});

exports.pool = pool;
