'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

var axios = require('axios');

restService.use(bodyParser.urlencoded({
    extended: true
}));

var TrendingNews = [];
function getTrendingNews() {
    axios('https://chooseapi.mybluemix.net/api/people?filter={%22where%22:{%22subject%22:%22Trending%20News%22}}', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     }})
    .then(function(response) {
       TrendingNews = (response.data).reverse();
     })
}

function postANew(news_piece){
  axios("https://chooseapi.mybluemix.net/api/people",{
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     data: {
        text: news_piece,
        subject: "Events",
        rank: 0,
        timestamp: "2017-06-11"
      }
   });
}

var USERS = ["Tim reports ", "Jennifer reports ", "Peter reports ", "Andy reports ", "Michelle reports "];

var index_localNews = -1;

function returnOneLocalNews(){
  index_localNews = index_localNews + 1;
  return USERS[index_localNews % USERS.length] + TrendingNews[index_localNews % TrendingNews.length].text;
}

var index_EventNews = -1;

var EventNews = [];
function getEventNews() {
    axios('https://chooseapi.mybluemix.net/api/people?filter={%22where%22:{%22subject%22:%22Events%22}}', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     }})
    .then(function(response) {
       EventNews = response.data.reverse();
     })
}
function returnOneEventNews(){
  index_EventNews = index_EventNews + 1;
  return USERS[index_EventNews % USERS.length] + EventNews[index_EventNews % EventNews.length].text;
}

var curent_path;

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    const speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "I don't understand Speak again.";
    let res_str;

   if (speech==="local news"){
      curent_path = "general"
      res_str =  "Here is some trending news. " + returnOneLocalNews() + " Say next to continue";
    }
    else if (speech==="next" && curent_path === "general"){
      res_str = returnOneLocalNews();
    }
    else if (speech==="repeat" && curent_path === "general"){
      index_localNews = index_localNews -1 ;
      res_str = returnOneLocalNews();
    }
    else if (speech === "topic"){
      curent_path = "topic";
      res_str = "What topic do you want?";
    }
    else if (speech === "events"){
      curent_path = "events";
      res_str = "Here is some news about local events. " + returnOneEventNews();
    }

   else if (speech==="next" && curent_path === "events"){
       res_str = returnOneEventNews();
    }
    else if (speech==="repeat" && curent_path === "events"){
      index_EventNews = index_EventNews - 1;
       res_str = returnOneEventNews();
    }

   else if (speech === "report a news"){
      curent_path = "report a news";
      res_str = "Tell me what you want to report.";
    }
    else if (curent_path === "report a news"){
      curent_path = "confirmation";
      res_str = "You say " + speech + " Is that all right?"
      postANew(speech);
    }
    else if (curent_path === "confirmation" && speech === "Yes"){
      curent_path = "";
      res_str = "It is added";
    }
    else {
      res_str = "I don't understand Speak again.";
    }

   return res.json({
        speech: res_str,
        displayText: res_str,
        source: ''
    });
});



restService.listen((process.env.PORT || 8000), function() {
    getTrendingNews();
    console.log("Server up and listening");
});
