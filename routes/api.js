const express = require("express")
const router = express.Router()

router.get('/books', function (req, res, next) {

    // Query database to get all the books
    let sqlquery = "SELECT * FROM bookds"

    const termSearch = req.query.search_term; 
    if (termSearch)    
        {
            sqlQuery += ` WHERE title LIKE '%${termSearch}%' OR description LIKE '%${termSearch}%'`; 
        }
    // Execute the sql query
    db.query(sqlquery, (err, result) => {
        // Return results as a JSON object
        if (err) {
            res.json(err)
            next(err)
        }
        else {
            res.json(result)
        }
    })
})

module.exports = router