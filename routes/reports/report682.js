var express = require('express');
var pool = require('../../modules/mssql').pool;
var Request = require('tedious').Request;
var router = express.Router();

var deviceList = function(req,res,next){

  var result = [];
  pool.acquire(function(err, connection){
    if(err){
      console.error(err);
      return;
    }
    console.log('Connection successful');

    //var request = new Request('select * from [test].[dbo].t1', function(err, rowCount){
    var request = new Request("SELECT [terminalMac],count(*) FROM [AgileControllerDB].[dbo].[TSM_E_RadiusLoginOrLogoutLog] where [sessionID] != '' and terminalIp!= '' and CONVERT (date, timestamp) between '"+req.param('start')+"' and '"+req.param('end')+"' and [terminalMac] like '%"+req.param('termac')+"%' group by [terminalMac]", function(err, rowCount){

      if(err){
        console.error(err);
        return;
      }
      console.log('rowCount: ' + rowCount);
      //console.log(JSON.stringify(result));
      req.test2 = result;
      connection.release();
      next();
    });

    request.on('row', function(columns){
      //result.push(columns);
      columns.forEach(function(column){
        if(column.value === null) {
          console.log('NULL');
        }
        else{
			result.push(column.value);
          //console.log(column.value);
        }
      });
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


