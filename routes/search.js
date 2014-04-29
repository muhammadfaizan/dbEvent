/**
 * Created by Muhammad Faizan on 4/25/14.
 */
"use strict";
var db = require('../db');
var url = require('url');
var Emitter = require("events").EventEmitter;
var async = require("async");
var complete = new Emitter();
//var parse = require('parser');

exports.service = function(req,res){
    var url_parts = url.parse(req.url, true);
    var data = url_parts.query;
    var key = decodeURIComponent(data.keyword.replace(/\+/g,' '));
    var count = 0;

    complete.on("dataFilled",function(result,toCount){
        count++;
        if (count == toCount){
            res.json(result);
        }
    });
    var searchingFor = [];
    var ind = key.indexOf(' ');
    while( ind != -1){
        searchingFor.push(key.substring(0,ind));
        key = key.substring(ind+1);
        ind = key.indexOf(' ');
    }
    searchingFor.push(key);

    var result = [];

    for (var i = 0; i< searchingFor.length; i++){


        var query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName LIKE '%"
            + searchingFor[i]
            + "%' OR lName LIKE '%"
            + searchingFor[i]
            + "%' OR email LIKE '%"
            + searchingFor[i]
            + "%'";
        console.log(query);

        db.querydb(query).then(
            function(data){
                //console.log(data);
                data.forEach(function(slot){
                    result.push(slot);
                });

                complete.emit("dataFilled",result,searchingFor.length);

            },
            function(err){
                console.log(err);
            });
    }


}



/*
 exports.search = function(req,res){
 var keyword = req.body.keyword;
 var words = [];
 var result = [];

 console.log(keyword);
 if(keyword){
 var index = keyword.indexOf(' ');
 while( index !== -1){
 words.push(keyword.substring(0,index));
 keyword = keyword.substring(index+1);
 index = keyword.indexOf(' ');
 }

 var queries = [];
 *//* if(words.length === 2){
 var query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName= '" + words[0] + "' OR lName = '"+ words[1] + "'";
 queries.push(query);
 query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName= '" + words[1] + "' OR lName = '"+ words[0] + "'";
 queries.push(query);
 query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName= '" + words[0]
 + "' OR lName = '"
 + words[0]
 + "' OR email ='"
 + words[0]
 + "' userName = '"
 + words[0] + "'";
 queries.push(query);
 console.log(query);
 }
 words.forEach(function(item){
 query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName= '"
 + item
 + "' OR lName = '"
 + item
 + "' OR email ='"
 + item
 + "' userName = '"
 + item + "'";
 console.log(query);
 queries.push(query);
 });

 queries.forEach(function(item){
 db.querydb(item).then(
 function(data){
 console.log(data);

 result.push(data);
 },
 function(err){
 res.json(result);
 },

 function(prog){
 console.log(prog);
 result.push(prog);

 res.json(result);
 }
 )
 });*//*

 // Test
 *//*var query = "SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName = '"
 + keyword;
 + "' OR lName = '"
 + keyword;
 + "' OR email ='"
 + keyword;
 + "' userName = '"
 + keyword+ "'";*//*

 db.querydb("SELECT fName, lName, userName, email, imgUrl FROM users WHERE fName = 'amin' OR lName = 'amin' OR email = 'amin' OR userName = 'amin'").then(
 function(data){
 result.push(data);
 },
 function(err){
 console.log(err);
 res.end();
 }*//*,
 function(progress){
 console.log(progress);
 res.json(progress);
 }*//*
 )
 res.json(result);
 }

 res.end();
 }*/
