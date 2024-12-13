// Create a new router, express and bcrypt
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');
const expressSanitizer = require('express-sanitizer');

router.use(expressSanitizer());

const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') //Redirects back to the login page
    } else { 
        next (); // Moves onto the next middleware
    } 
};

const registerValidation = [
    check('email').isEmail().withMessage('The email you entered is invalid, please try again'),
    check('password').isLength({ min: 7 }).withMessage('Password must be minimum 7 characters long'),
    check('username').not().isEmpty().withMessage('Username required'),
    check('first').not().isEmpty().withMessage('First name required'),
    check('last').not().isEmpty().withMessage('Last name required')
];


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', registerValidation, function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./register'); }
    else { 
    const userName = req.sanitize(req.body.username);
    const firstName = req.sanitize(req.body.first);
    const lastName = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const plainPassword = req.body.password;
    const saltRounds = 10;

    // Stores hashed password in the database
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
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
    }
});

    router.get('/list', redirectLogin, function (req, res) {
        let sqlQuery = "SELECT id, username, firstName, lastName, email FROM users";
        db.query(sqlQuery, (err, result) => {
            if (err) {
                return next(err);
            }
            // Renders the user list page by passing the user data
            res.render("listUsers.ejs", {users: result});
        });
    });

router.get('/login', redirectLogin, function(req, res, next) {
    res.render('login');
});

router.post('/loggedin', function(req, res, next) {
    const { username, password } = req.body;
    let sqlQuery = "SELECT hashedPassword FROM users WHERE username = ?";
    db.query(sqlQuery, [username], function(err, results) {
        if (err) return next(err);
        if (results.length > 0) {
            bcrypt.compare(password, results[0].hashedPassword, function(err, result) {
                if (result) {
                    // Saves user session when the login is successful
                    req.session.userId = req.body.username;
                    res.send('Successful Loginl!');
                } else {
                    res.send('Login failed: Incorrect username or password.');
                }
            });
        } else {
            res.send('Failed Login: User Cannot Be Found.');
        }
    });
});

// Export the router object so index.js can access it
module.exports = router