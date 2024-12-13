// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
    const userName = req.body.username;
    const firstName = req.body.first;
    const lastName = req.body.last;
    const email = req.body.email;
    const plainPassword = req.body.password;
    const saltRounds = 10;

    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database
        if (err) {
            return next(err);
        }

        let sqlQuery = "INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES (?,?,?,?,?)";
        let newDetails = [userName, firstName, lastName, email, hashedPassword];

        db.query(sqlQuery, newDetails, (err, result) => {
            if (err) {
                return next(err);
            }

            let registration = 'Hi ' + firstName + ' ' + lastName + ' You Are Now Registered To D Portfolio! You Should Receieve An Email Confirmation At ' + email; 
            registration += ' Please Note That Your Password is: ' + plainPassword + ' And Your Hashed Password is: ' + hashedPassword; 
            res.send(registration);

        });
    });
});

router.get('/list', function(req, res, next) {
    let sqlQuery = "SELECT id, username, firstName, lastName, email FROM users";
    db.query(sqlQuery, (err, result) => {
        if (err) {
            return next(err);
        }
        // Render the user list page, passing the user data
        res.render("listUsers.ejs", {users: result});
    });
});


// Export the router object so index.js can access it
module.exports = router