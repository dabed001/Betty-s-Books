// Creates a new router and express
const express = require("express")
const router = express.Router()

router.get('/books', function (req, res, next) {

    // Queries database to retrieve all books
    let sqlquery = "SELECT * FROM bookds"

    const termSearch = req.query.search_term; 
    if (termSearch)    
        {
            sqlQuery += ` WHERE title LIKE '%${termSearch}%' OR description LIKE '%${termSearch}%'`; 
        }
    // Execution
    db.query(sqlquery, (err, result) => {
        // Returning results as a JSON Object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

// Export the router object so index.js can access it
module.exports = router