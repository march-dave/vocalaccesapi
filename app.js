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
    axios('https://chooseapi.mybluemix.net/api/people', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     }})
    .then(function(response) {
       TrendingNews = response.data;
     })
}

var index_localNews = 0;

function returnOneLocalNews(){
  index_localNews = index_localNews + 1;
  return TrendingNews[index_localNews % TrendingNews.length];
}

var index_EventNews = 0;

var EventNews = [];

function returnOneEventNews(){
  index_EventNews = index_EventNews + 1;
  return EventNews[index_EventNews % EventNews.length];
}



var curent_subject = '';

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    const speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "I don't understand Speak again.";
    let res_str;

   if (speech==="local news"){
      curent_path = "general"
      res_str =  "Here is some trending news. " + returnOneLocalNews() + "Say next to continue";
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
