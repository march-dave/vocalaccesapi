'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

var TrendingNews = [];
function getTrendingNews() {
    fetch('https://chooseapi.mybluemix.net/api/people', {
     method: 'GET',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     }})
    .then(function(response) {
       TrendingNews = response.text()
     })
}

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    const speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "I don't understand Speak again.";

   return res.json({
        speech: TrendingNews.toString(),
        displayText: TrendingNews.toString(),
        source: ''
    });
});


restService.listen((process.env.PORT || 8000), function() {
   getTrendingNews();
    console.log("Server up and listening");
});
