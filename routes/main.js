// Creates a new router, express and request
const express = require("express")
const router = express.Router()
const request = require('request');

// Handles our routes
router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('You Are Now Logged Out Of Bettys Books. <a href='+'./'+'>Home</a>');
    })
});

// Route handler for weather
router.get('/londonnow', redirectLogin, (req,res) => {
    let apiKey = 'f745ab43d346c872678e88b1e6edade3'
    let city = 'london'
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
                 
    request(url, function (err, response, body) {
      if(err){
        next(err)
      } else {
            try {
            var currentWeather = JSON.parse(body);
            // Checks if data is available before portraying
            if (currentWeather !== undefined && currentWeather.main !== undefined && currentWeather.name) {
                var wmsg = 'It is currently ' + currentWeather.main.temp + 
                ' degrees in ' + currentWeather.name +
                '! <br> The humidity now is: ' + 
                currentWeather.main.humidity;
                res.send(wmsg);
            } else {
                // Handles any cases where weather data cannot be found or is incomplete
                res.send("No data found for the specified location.");
            }
        } catch (e) {
            // JSON handler for parsing errors or other exceptions
            res.send("Failed to parse weather data. Please try again later.");
        }
      } 
    });
});

router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

// Export the router object so index.js can access it
module.exports = router