module.exports = function ( router ) {


	// Start page
	router.get( '/prototype-version-2/start', function ( req, res ) {
		res.render( 'prototype-version-2/start' );
	} );

	// sign in
	router.get( '/prototype-version-2/sign-in', function ( req, res ) {
		res.render( 'prototype-version-2/sign-in' );
	} );

	//enter details
	router.get( '/prototype-version-2/enter-details', function ( req, res ) {
		res.render( 'prototype-version-2/enter-details' );
	} );

	// view transaction history
	router.get( '/prototype-version-2/view-trans', function ( req, res ) {
		res.render( 'prototype-version-2/view-trans' );
	} );

	// enter amount you want to pay
	router.get( '/prototype-version-2/enter-amount', function ( req, res ) {
		res.render( 'prototype-version-2/enter-amount' );
	} );

	// review amount you want to pay
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
