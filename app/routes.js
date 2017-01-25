var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  req.session.destroy()
  res.render('index')
})

// Initial design
require('./routes/ABS.js')(router)

// Ammended design
require('./routes/CH.js')(router)

module.exports = router
