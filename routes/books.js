// Creates a new router and express
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', function (req, res, next) {
    // Search and queries the database to retrieve all books
    let sqlquery = "SELECT * FROM books WHERE name LIKE '%" + req.query.search_text + "%'" 
    // Execution
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
     }) 
})

// Queries the database to retrieve all books
router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM books" 
    // Execution
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
     })
})

router.get('/addbook', function (req, res, next) {
    res.render('addbook.ejs')
})

router.post('/bookadded', function (req, res, next) {
    // Saves input data in the database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // Execution
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This Book Has Been Added to the Database, Book Name: '+ req.body.name + ' Price '+ req.body.price)
    })
}) 

router.get('/bargainbooks', function(req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20"
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("bargains.ejs", {availableBooks:result})
    })
}) 


// Export the router object so index.js can access it
module.exports = router