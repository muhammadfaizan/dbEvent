var db = require('../db');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var mailing = require('mailing');

exports.activator = function(req,res){
    var username = req.params.username;

    console.log(username);
    var query = "UPDATE users SET isActivated = '1'  WHERE userName = '"+ username + "'";
    console.log(query);

    db.querydb(query)
        .then(function(data){
            console.log(data);
            res.redirect('/');
            ''
        },
        function(err){
            console.log(err);
        }
    );
    res.end();
}

exports.uploadPic = function(req,res){

    fs.readFile(req.files.image.path,function(err,data){

        var name = req.files.image.name;
        if( !req.session.userName){
            req.session.userName = "tester";
        }


        var salt = bcrypt.genSaltSync(10);
        var imageName = bcrypt.hashSync(req.session.userName, salt);



        for( var x = 0 ; x < imageName.length; x++){
            if( imageName[x] == "\\" || imageName[x] == "/" || imageName[x] == "?" || imageName[x] == ":" || imageName[x] == "*" || imageName[x] == "|"){
                imageName = imageName.substring(0,x) + imageName.substring(x+1);
                x--;
            }
        }
        //var imageName = req.session.userName;
        for (var i = name.length-4; i< name.length; i++ ){
            imageName+=name[i];
        }


        var newPath = __dirname + "/"+ imageName;

        fs.writeFile(newPath,data,function(err){
            if(err){
                res.send("error");
            }


            var headers = {
                'Content-Type' : 'image/jpg',
                'x-amz-acl'    : 'public-read'
            };

            console.log("https://s3-ap-southeast-1.amazonaws.com/elasticbeanstalk-ap-southeast-1-314976083393/Images"+ "/" +imageName);
            var uploader = client.upload(newPath, "Images"+ "/" +imageName);
            uploader.on('error', function(err) {
                res.send(err);
                console.error("unable to upload:", err.stack);
            });
            uploader.on('progress', function(amountDone, amountTotal) {
                console.log("progress", amountDone, amountTotal);
            });
            uploader.on('end', function(url) {
                console.log("********************+*+*+*+*+*+*+*+*+*+*")
                console.log("https://s3-ap-southeast-1.amazonaws.com/elasticbeanstalk-ap-southeast-1-314976083393/Images"+ "/" +imageName);
                //res.send(url);
                fs.unlink(newPath,function(err){
                    if( !err){
                        console.log(newPath + "is Outta my system baby...");
                    }
                });

                var query = "UPDATE users WHERE userName = '"+req.session.userName + "' SET imgUrl ="+ imageName;
                /*
                 db.querydb(query).then(
                 function(data){
                 res.send(imageName);
                 },
                 function(err){
                 res.send(err);
                 }
                 );*/
            });
            /*res.send({
             status:200,
             success: true,
             error: null
             });*/
            res.end();
        });



    });
}

exports.sendImage = function (req, res){
    file = req.params.file;
    console.log(__dirname + "/" + file);

    var img = fs.readFileSync(__dirname + "/" + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

};

exports.getUserData = function(req,res){
    var userId = req.session.user_id;
    db.userData([userId])
        .then(function(data){
            console.log(data);
            res.send(data);
        },function(err){
            res.send("false");
        })
}

// Render The app page if in session else render the login page
// Route for (GET) login page
exports.index = function(req, res){

    if (req.session.user_id) {
        res.redirect('/home');
    } else {
        res.render('index');
    }

};

// Render The app
// Route for app page
exports.app = function (req, res) {
    res.render('app');
}

// Handle the login page post request from user
// Route for (POST) login page
exports.login =  function (req, res) {

    var post = req.body;
    console.log(post);
    var query = "SELECT * FROM users WHERE userName='"+post.user+"'";
    db.querydb(query)
        .then(
        function(data)   {
            console.log(data[0]);

            if(data.length>0)
            {
                var isItHash = bcrypt.compareSync(post.password, data[0].password);// true)
                console.log(isItHash);
            }


            if(typeof data !== 'undefined' && data.length > 0 && isItHash  && data[0].isActivated != 0)
            {
                console.log("***********************");
                console.log(data[0]);
                req.session.user_id = data[0].userId;
                req.session.userName = data[0].userName;
                req.session.fullName = data[0].fName+" "+data[0].lName;
                req.session.email = data[0].email;
                console.log(req.session.user_id);
                res.send("http://localhost:3000/");
            }
            else
            {
                console.log("i am here");
                res.send("false");

            }
        },

        function(error) {
            res.send("false");
            console.log(error)

        });
}

// handle the from data from signup page
// Route for (POST) signup page
exports.signup =  function (req, res) {
    var user = req.body;
    console.log(user);

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);

    //console.log("SELECT * FROM users WHERE userName = '"+ user.userName + "' OR email = '" + user.email+"'");
    db.querydb("SELECT * FROM users WHERE userName = '"+ user.userName + "' OR email = '" + user.email+"'")
        .then(
        function(data){
            if(data.length == 0 && user.userName !== '' && user.password !== ''  && user.password == user.confirm_password && user.email !== '' && user.gender !== '' && user.firstname !== '' && user.userName.indexOf(' ') == -1 ){

                var imageUrl = "https://s3-ap-southeast-1.amazonaws.com/elasticbeanstalk-ap-southeast-1-314976083393/Images/";
                if(user.gender == 'M')
                {
                    imageUrl += "male.png";
                }
                else {
                    imageUrl += "female.png";
                }

                var query = "INSERT INTO users (userName, password, email, fName, lName, gender, isActivated, imgUrl) VALUES ('"
                    + user.userName
                    + "','" + hash
                    + "','" + user.email
                    + "','" + user.fName
                    + "','" + user.lName
                    + "','" + user.gender
                    + "','" + "0"
                    + "','" + imageUrl
                    +"')";
                console.log(query);



                db.querydb(query)
                    .then(
                    function(data){
                        console.log(data);
                        mailing.service(user.email,user.userName);
                        res.send('http://localhost:3000/');
                    },
                    function(err){
                        console.log(err);
                        res.send("error3");
                    }
                );

            }
            else{
                if(data[0].userName == user.userName)
                {
                    console.log("true");
                    res.send("error1");
                }

                if(data[0].email == user.email)
                {
                    console.log("true");
                    res.send("error2");
                }



            }
        },
        function(error){
            console.log("i was at errorS")
            res.send("username or Email already registered");
        }
    )
}


/*---------------------- logout moved to app.js ----------------------*/
// Handle the logout button, will return to login page when clicked
// Route for logout button
//exports.logout = function (req, res) {
//    delete req.session.user_id;
//    res.redirect('/');
//}

exports.saveEvent = function(req,res){
    var post = req.body;
    console.log(post.date);
    var onDate=post.date.slice(0,10);

    var createdOn=post.time.slice(0,10);


    console.log("date is "+onDate);
    console.log("date is "+post.time);
    console.log("date is "+createdOn);
    var query = "INSERT INTO events (name, date, time, location, userId,createdOn) VALUES ('"
        + post.name             +"','"
        + onDate                +"','"
        + post.time                +"','"
        + post.location         +"','"
        + req.session.user_id   +"','"
        + createdOn             +"')";
    console.log(query);
    db.querydb(query)
        .then(
        function(data){
            console.log(data);
            res.send("true");
        },

        function(error){
            console.log(error+"From SaveEvent");
            res.send("false");
        });

}

exports.getEvents = function(req,res){
    var post = req.body;
    var query = "SELECT eventId,name,DATE_FORMAT(date,'%d %b %y') AS date,DATE_FORMAT(time, '%H:%i %p') AS time,location,userId,createdOn FROM events WHERE userId='"+req.session.user_id +"'";
    console.log(query+"From SaveEvent");
    db.querydb(query)
        .then(
        function(data){
            console.log(data);
            res.send(data);
        },
        function(error){
//                console.log(error);
            res.send("false");
        }
    )
}

exports.getAllUserEvents = function(req,res){
    var post = req.body;
    var query = "SELECT * FROM events";
    console.log(query+"From SaveEvent");
    db.querydb(query)
        .then(
        function(data){
            console.log(data);
            res.send(data);
        },
        function(error){
//                console.log(error);
            res.send("false");
        }
    )
}

exports.getFriendList = function(req,res){
    var post = req.body;
    var query = "SELECT * FROM friends WHERE (userId='"
        +req.session.user_id
        +"' OR friendId='" +req.session.user_id
        +"') AND areFriends='true'";
    console.log(query);
    db.querydb(query)
        .then(
        function(data){
            console.log(data);
            var friendArray = [];
            for(var i=0;i<data.length;i++){
                if(data[i].userId==req.session.user_id){
                    query = "SELECT userName, userId, imgUrl FROM users WHERE userId='"+data[i].friendId+"'";
                }
                else{
                    query = "SELECT userName, userId, imgUrl FROM users WHERE userId='"+data[i].userId+"'";
                }
                db.querydb(query)
                    .then(
                    function(result){
                        console.log(result);
                        friendArray.push(result[0]);
                        if(friendArray.length==data.length){
                            console.log("Sending");
                            res.send(friendArray);
                        }
                    },
                    function(error){
                        console.log(error);
                        res.send("false");
                    }
                )

            }

        },
        function(error){
            console.log(error);
            res.send("false");
        }
    )
}

exports.getOtherUsers = function(req,res){
    var data = req.body;
    var query = "SELECT userId, userName, imgUrl FROM users WHERE ";
    if(data.length > 0)
    {
        for(var i = 0; i<data.length;i++){
            if(i == 0){
                query += "userId <>'"+data[i].userId+"'";
            }
            else{
                query += " AND userId <>'"+data[i].userId+"'";
            }
        }
        query += "AND userId <>'"+req.session.user_id+"'";
    }
    else
    {
        query += "userId <>'"+req.session.user_id+"'";
    }

    console.log(query);
    db.querydb(query)
        .then(
        function(data){
            console.log(data);
            res.send(data);
        },
        function(error){
            console.log(error);
            res.send("false");
        }
    )
}

exports.postComment = function(req,res){
    var d = new Date();
    var post = req.body;

    var userId = req.session.user_id,
        eventId = req.body.eventId,
        body = req.body.commentBody,
        date = d.getFullYear()+"-"+d.getMonth()+"-"+ d.getDate();
    time = d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds();
    console.log(date);
    console.log(time);
    // to return
    var comment = [{
        "body":req.body.commentBody,
        "fullName":req.session.fullName,
        "userName":req.session.userName
    }];




    var query = "INSERT INTO comments (userId, eventId, body, date, time) VALUES ('"
        + userId    +"','"
        + eventId   +"','"
        + body      +"','"
        + date      +"','"
        + time      +"')";
    console.log(query);

    db.querydb(query)
        .then(
        function(data){
            //console.log(data);

            res.send(comment[0]);
        },

        function(error){
            console.log(error);
            res.send("false");
        });
}

exports.getComments = function(req,res){
    var post = req.body;
    var allUsers = [];
    var query = "SELECT body, userId FROM comments WHERE eventId='"+post.eventId +"'";
    console.log(query);
    db.querydb(query)
        .then(
        function(data){
            console.log(data);
            for(var i=0;i<data.length;i++){
                if(allUsers.indexOf(data[i].userId) == -1){
                    allUsers.push(data[i].userId);
                }
            }
            console.log(allUsers);

            db.userData(allUsers)
                .then(function(data2){
                    console.log("In second promise:",data2);

                    for(var i = 0; i< data.length;i++)
                    {
                        for(var j=0;j<data2.length;j++){
                            if(data[i].userId==data2[j].userId){
                                delete data[i].userId;
                                data[i]['userName'] = data2[j].userName;
                                data[i]['fullName'] = data2[j].fName+" "+data2[j].lName;
                                data[i]['imgUrl'] = data2[j].imgUrl;
                            }
                        }
                    }
                    res.send(data);

                },
                function(error){
                    console.log(error);
                    res.send("false");
                });
        },
        function(error){
//                console.log(error);
            res.send("false");
        });

}

exports.uploadImage = function(req,res){
    console.log("File Data",req.body);
}

exports.changeBasicInfo = function(req,res){
    console.log("Data received",req.body);
    var userId = req.session.user_id,
        lName = req.body.lName,
        fName = req.body.fName,
        fbProfile = req.body.fbProfile,
        mobileNumber = req.body.mobileNumber,
        gender = req.body.gender,
        DOB = req.body.DOB
    var query = "UPDATE users SET "
        +"fName='"+ fName    +"',"
        +"lName='"+ lName   +"',"
        +"gender='"+ gender    +"',"
        +"fbProfile='"+ fbProfile    +"',"
        +"mobileNumber='"+ mobileNumber    +"',"
        +"DOB='"+ DOB    +"'"
        +" WHERE userId='"+ userId    +"'";
    console.log(query);

    db.querydb(query)
        .then(
        function(data){
            //console.log(data);
            res.send(req.body);
        },

        function(error){
            console.log(error);
            res.send("false");
        });

}

exports.changePassword = function(req,res){
    console.log(res.body);
    res.send("false");
}

exports.getnoti = function(req,res){
    var post = req.body;
    var query = "SELECT eventId FROM eventsInvitation WHERE userId='"+req.session.user_id +"'";
    console.log(query);
    db.querydb(query)
        .then(
        function(data){
            console.log("All event id for notifications",data);

            var query2 = "SELECT * FROM notifications WHERE " ;
            if(data.length > 0)
            {
                for(var i = 0; i<data.length;i++){
                    if(i == 0)
                    {
                        query2 +="((eventId='"+data[i].eventId+"'"

                    }
                    else{
                        query2 += " OR eventId='"+data[i].eventId+"'";
                    }

                }
                query2 += ") AND senderId <>'"+req.session.user_id+"') OR ";
            }
            query2 += "receiverId='"+req.session.user_id+"'";

            console.log(query2);
            db.querydb(query2)
                .then(
                function(data2){
                    console.log("All notification for eventId",data2);
                    res.send(data2);
                },
                function(error){
//                console.log(error);
                    res.send("false");
                }
            )

        },
        function(error){
//                console.log(error);
            res.send("false");
        }
    )
}

