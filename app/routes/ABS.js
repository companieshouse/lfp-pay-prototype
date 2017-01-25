module.exports = function (router) {
  // Start page
  router.get('/ABS/start', function (req, res) {
    req.session.destroy()
    res.render('ABS/start')
  })

  // sign in
  router.get('/ABS/sign-in', function (req, res) {
    res.render('ABS/sign-in')
  })

  // Enter details
  router.get('/ABS/enter-details', function (req, res) {
    res.render('ABS/enter-details')
  })

  // view transaction history
  router.get('/ABS/view-trans', function (req, res) {
    res.render('ABS/view-trans')
  })

  // enter amount you want to pay
  router.get('/ABS/enter-amount', function (req, res) {
    res.render('ABS/enter-amount')
  })

  // review amount you want to pay
  router.get('/ABS/review-amount', function (req, res) {
    res.render('ABS/review-amount')
  })

  // gov uk pay page
  router.get('/ABS/gov-pay-1', function (req, res) {
    res.render('ABS/gov-pay-1')
  })

  // gov uk pay page
  router.get('/ABS/gov-pay-2', function (req, res) {
    res.render('ABS/gov-pay-2')
  })

  // gov uk pay page
  router.get('/ABS/gov-pay-confirm', function (req, res) {
    res.render('ABS/gov-pay-confirm')
  })

  // process complete
  router.get('/ABS/complete', function (req, res) {
    res.render('ABS/complete')
  })
}
