var express = require( 'express' )
var router = express.Router()

// Route index page
router.get( '/', function ( req, res ) {
	res.render( 'index' )
} );

// Initial design
require( './routes/initial-design.js' )( router );

// Ammended design
//require( './routes/ammended-design.js' )( router );

module.exports = router;
