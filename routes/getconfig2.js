var express = require('express');
var pool = require('../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req, res, next) {

    var result = {};
    pool.acquire(function(err, connection) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Connection successful');
        q = '"';
        var request = new Request("select c_name,c_value from [AgileControllerDB].[dbo].[UMS_Config]", function(err, rowCount) {

            if (err) {
                console.error(err);
                return;
            }
            console.log('rowCount: ' + rowCount);
            //console.log(JSON.stringify(result));
            req.test2 = result;
            connection.release();
            next();
        });

        request.on('row', function(columns) {

            //result.push(columns);
            var item = {}; //new
            //console.log(columns);
            columns.forEach(function(column) {
                //console.log(column);
                item[column.metadata.colName] = column.value; //new
                /*if (column.value === null) {
                    console.log('NULL');
                } else {
                    result.push(column.value);
                    //console.log(column.value);
                }
                */
            });
            result.push(item);
            //result = item;
        });
        connection.execSql(request);
    });


}


router.get('/', deviceList, function(req, res, next) {
    //console.log('middleware 1 ' + req.test2);
    //console.log('middleware 2 ' + JSON.stringify(req.test2));
    res.send(req.test2);
});

module.exports = router;