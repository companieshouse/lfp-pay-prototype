var express = require( 'express' )
var router = express.Router()

// Route index page
router.get( '/', function ( req, res ) {
	res.render( 'index' )
} );

// Initial design
require( './routes/prototype-version-1.js' )( router );

// Ammended design
require( './routes/prototype-version-2.js' )( router );

module.exports = router;
