// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request');

// Handle our routes
router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
});

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
            // Check if the necessary data is available before trying to access it
            if (currentWeather !== undefined && currentWeather.main !== undefined && currentWeather.name) {
                var wmsg = 'It is currently ' + currentWeather.main.temp + 
                ' degrees in ' + currentWeather.name +
                '! <br> The humidity now is: ' + 
                currentWeather.main.humidity;
                res.send(wmsg);
            } else {
                // Handle cases where the weather data is incomplete or missing
                res.send("No data found for the specified location.");
            }
        } catch (e) {
            // Handle JSON parsing errors or other exceptions
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