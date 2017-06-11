'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const restService = express();

const axios = require('axios');

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

      console.log('response');
      console.log(response.data[0].firstname);

       TrendingNews = response.data;
     })

   // axios.get('https://chooseapi.mybluemix.net/api/people')
   //    .then(function (res) {
   //      app.ask(res.body[0].firstname);
   //    })
}

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    const speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "I don't understand Speak again.";

   return res.json({
        speech: TrendingNews[0].firstname,
        displayText: TrendingNews[0].firstname,
        source: ''
    });
});


restService.listen((process.env.PORT || 8000), function() {
   getTrendingNews();
    console.log("Server up and listening");
});
