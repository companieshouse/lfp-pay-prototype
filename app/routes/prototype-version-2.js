module.exports = function ( router ) {

	// Start page
	router.get( '/prototype-version-2/start', function ( req, res ) {
		res.render( 'prototype-version-2/start' );
	} );

	//enter details
	router.get( '/prototype-version-2/enter-details', function ( req, res ) {
		res.render( 'prototype-version-2/enter-details' );
	} );

	//enter details
	router.post( '/prototype-version-2/view-late-filing-penalty', function ( req, res ) {
		var penalty = req.body.reference;
		if ( penalty === "" ) {
			res.redirect( '/prototype-version-2/enter-details' );
		} else {
			if ( penalty == "PEN1A/01234567" ) {
				res.render( 'prototype-version-2/multiple-penalty' );
			} else {
				res.render( "prototype-version-2/single-penalty" );
			}
		}
	} );

	// view transaction history
	router.get( '/prototype-version-2/view-late-filing-penalty', function ( req, res ) {
		res.render( 'prototype-version-2/view-late-filing-penalty' );
	} );

	// enter amount you want to pay from prototype version 1
	router.get( '/prototype-version-2/enter-amount', function ( req, res ) {
		res.render( 'prototype-version-2/enter-amount' );
	} );

	// review payment amount
	router.get( '/prototype-version-2/review-amount', function ( req, res ) {
		res.render( 'prototype-version-2/review-amount' );
	} );

	// gov uk pay page
	router.get( '/prototype-version-2/gov-pay-1', function ( req, res ) {
		res.render( 'prototype-version-2/gov-pay-1' );
	} );

	// gov uk pay page
	router.get( '/prototype-version-2/gov-pay-2', function ( req, res ) {
		res.render( 'prototype-version-2/gov-pay-2' );
	} );

	// gov uk pay page
	router.get( '/prototype-version-2/gov-pay-confirm', function ( req, res ) {
		res.render( 'prototype-version-2/gov-pay-confirm' );
	} );

	// process complete
	router.get( '/prototype-version-2/complete', function ( req, res ) {
		res.render( 'prototype-version-2/complete' );
	} );
};
