const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const { spawn } = require('child_process');
const got = require('got');
const test = require('tape');


const apiKey = '9b89c1c286c89671e48b2e46b105dc18';

// Start the app
const env = Object.assign({}, process.env, {PORT: 2000});
const child = spawn('node', ['indexw.js'], {env});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('indexw', {weather: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    // Wait until the server is ready
    child.stdout.on('data', _ => {
      // Make a request to our app
      (async () => {
        const response = await got('http://127.0.0.1:2000');
        // stop the server
        child.kill();
    request(url, function (err, response, body) {
      if(err){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weather = JSON.parse(body)
        if(weather.main == undefined){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('index', {weather: weatherText, error: null});
      }
      }
    });
   })(); 
  });
});







