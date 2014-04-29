exports.connectdb = function(req,res){

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'aat17oo485vipp.cmjrbdxzger9.ap-southeast-1.rds.amazonaws.com',
        user     : 'dbevent',
        password : 'aai09jq1tr99gy',
        database: 'dbevent'
    });

    connection.connect();

    connection.query('SELECT * FROM users', function(err, rows, fields) {
        if (err) {

            res.send("not connected");
        }
        else {
            res.send(rows);
        }


    });

    connection.end();

};/**
 * Created by AminAhmed on 3/29/14.
 */
