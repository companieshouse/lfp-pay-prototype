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

  // Enter details
  router.post('/ABS/enter-details', function (req, res) {
    var penalty = req.body.reference
    var companyno = req.body.companyno
    var penaltyErr = {}
    var companyErr = {}
    var errorFlag = false
    var scenario = {}
    var i = 0

    // VALIDATE USER INPUTS
    if (companyno.length < 8) {
      companyErr.type = 'invalid'
      companyErr.msg = 'You must enter your full eight character company number'
      companyErr.flag = true
      errorFlag = true
    }
    if (penalty !== 'PEN1A/12345678' && penalty !== 'PEN2B/12345678' && penalty !== 'PEN2A/12345678') {
      penaltyErr.type = 'invalid'
      penaltyErr.msg = 'Enter your penalty reference exactly as shown on your penalty letter'
      penaltyErr.flag = true
      errorFlag = true
    }
    if (penalty === '') {
      penaltyErr.type = 'blank'
      penaltyErr.msg = 'You must enter a penalty reference'
      penaltyErr.flag = true
      errorFlag = true
    }

    // CHECK ERROR FLAG
    if (errorFlag === true) {
      res.render('ABS/enter-details', {
        penaltyErr: penaltyErr,
        companyErr: companyErr,
        penalty: penalty,
        companyno: companyno
      })
    } else {
      if (penalty === 'PEN2A/12345678') {
        scenario.entryRef = penalty
        scenario.company = {
          name: 'LAKE AVIATION LIMITED',
          number: companyno
        }
        scenario.penalties = [
          {
            reference: 'PEN2A/12345678',
            period: '30 April 2015',
            due: '1 January 2016',
            filed: '15 January 2016',
            overdue: '14 days',
            band: 'Up to 1 month overdue',
            value: 150,
            fees: {
              debtRecovery: [
                {
                  name: 'First letter',
                  date: '1 January 2017',
                  value: 60.00
                },
                {
                  name: 'Second letter',
                  date: '1 February 2017',
                  value: 60.00
                },
                {
                  name: 'Third letter',
                  date: '1 March 2017',
                  value: 60.00
                }
              ]
            },
            totalFees: 0
          }
        ]

        for (i = 0; i < scenario.penalties[0].fees.debtRecovery.length; i++) {
          scenario.penalties[0].totalFees += scenario.penalties[0].fees.debtRecovery[i].value
        }

        req.session.scenario = scenario
        res.redirect('/ABS/view-trans')
      } else if (penalty === 'PEN2B/12345678') {
        scenario.entryRef = penalty
        scenario.company = {
          name: 'XYZ ARCHITECTS LIMITED',
          number: companyno
        }
        scenario.penalties = [
          {
            reference: 'PEN2B/12345678',
            period: '30 April 2015',
            due: '1 January 2016',
            filed: '15 January 2016',
            overdue: '14 days',
            band: 'Up to 1 month overdue',
            value: 150,
            fees: {
              /*
              debtRecovery: [
                {
                  name: 'First letter',
                  date: '1 January 2017',
                  value: 60.00
                },
                {
                  name: 'Second letter',
                  date: '1 February 2017',
                  value: 60.00
                },
                {
                  name: 'Third letter',
                  date: '1 March 2017',
                  value: 60.00
                }
              ],
              */
              solicitor: [
                {
                  name: 'COSTS',
                  date: '23 April 2016',
                  value: 50.00,
                  ref: 'REF-1',
                  mud: '30 April 2015'
                }
              ],
              court: [
                {
                  name: 'COSTS',
                  date: '23 April 2016',
                  value: 47.00,
                  ref: 'REF-2',
                  mud: '30 April 2015'
                }
              ]
            },
            totalFees: 0
          }
        ]

        /*
        for (i = 0; i < scenario.penalties[0].fees.debtRecovery.length; i++) {
          scenario.penalties[0].totalFees += scenario.penalties[0].fees.debtRecovery[i].value
        }
        */

        for (i = 0; i < scenario.penalties[0].fees.solicitor.length; i++) {
          scenario.penalties[0].totalFees += scenario.penalties[0].fees.solicitor[i].value
        }

        for (i = 0; i < scenario.penalties[0].fees.court.length; i++) {
          scenario.penalties[0].totalFees += scenario.penalties[0].fees.court[i].value
        }

        req.session.scenario = scenario
        res.redirect('/ABS/view-trans')
      } else if (penalty === 'PEN1A/12345678') {
        scenario.entryRef = penalty
        scenario.company = {
          name: 'TEST METHODS LIMITED',
          number: companyno
        }
        scenario.penalties = [
          {
            reference: 'PEN1A/12345678',
            period: '30 April 2015',
            due: '1 January 2016',
            filed: '15 January 2016',
            overdue: '14 days',
            band: 'Up to 1 month overdue',
            value: 150,
            totalFees: 0
          }
        ]
        req.session.scenario = scenario
        res.redirect('/ABS/view-trans')
      }
    }
  })

  // view transaction history
  router.get('/ABS/view-trans', function (req, res) {
    var scenario = req.session.scenario

    if (scenario != null) {
      res.render('ABS/view-trans', {
        scenario: scenario
      })
    } else {
      res.redirect('/ABS/enter-details')
    }
  })

  // enter amount you want to pay
  router.get('/ABS/enter-amount', function (req, res) {
    var scenario = req.session.scenario

    if (scenario != null) {
      res.render('ABS/enter-amount', {
        scenario: scenario
      })
    } else {
      res.redirect('/ABS/enter-details')
    }
  })

  // enter amount you want to pay
  router.post('/ABS/enter-amount', function (req, res) {
    var scenario = req.session.scenario
    var mud = {
      day: req.body.mudDay,
      month: req.body.mudMonth,
      year: req.body.mudYear
    }
    var paymentAmount = req.body.paymentAmount
    var paymentErr = {}
    var mudErr = {}
    var errorFlag = false

    // VALIDATE USER INPUTS
    if (paymentAmount === '') {
      paymentErr.type = 'null'
      paymentErr.msg = 'You must tell us how much you want to pay'
      errorFlag = true
    }
    if (mud.day !== '' || mud.month !== '' || mud.year !== '') {
      if (mud.day === '' || mud.month === '' || mud.year === '') {
        mudErr.type = 'null'
        mudErr.msg = 'You must provide a full made up date'
        errorFlag = true
      }
    }

    // CHECK ERROR FLAG
    if (errorFlag === true) {
      res.render('ABS/enter-amount', {
        scenario: scenario,
        paymentErr: paymentErr,
        mudErr: mudErr,
        paymentAmount: paymentAmount,
        mud: mud
      })
    } else {
      req.session.paymentAmount = paymentAmount
      if (mud.day !== '') {
        mud.day = parseInt(mud.day)
        switch (parseInt(mud.month)) {
          case 1:
            mud.month = 'January'
            break
          case 2:
            mud.month = 'February'
            break
          case 3:
            mud.month = 'March'
            break
          case 4:
            mud.month = 'April'
            break
          case 5:
            mud.month = 'May'
            break
          case 6:
            mud.month = 'June'
            break
          case 7:
            mud.month = 'July'
            break
          case 8:
            mud.month = 'August'
            break
          case 9:
            mud.month = 'September'
            break
          case 10:
            mud.month = 'October'
            break
          case 11:
            mud.month = 'November'
            break
          case 12:
            mud.month = 'December'
            break
          default:
            mud.month = 'January'
        }
        req.session.mud = mud
      }
      res.redirect('/ABS/review-amount')
    }
  })

  // review amount you want to pay
  router.get('/ABS/review-amount', function (req, res) {
    var scenario = req.session.scenario
    var paymentAmount = req.session.paymentAmount
    var mud = req.session.mud

    res.render('ABS/review-amount', {
      scenario: scenario,
      paymentAmount: paymentAmount,
      mud: mud
    })
  })

  // gov uk pay page
  router.get('/ABS/gov-pay-1', function (req, res) {
    var scenario = req.session.scenario
    var paymentAmount = req.session.paymentAmount
    var mud = req.session.mud

    if (scenario != null) {
      res.render('ABS/gov-pay-1', {
        scenario: scenario,
        paymentAmount: paymentAmount,
        mud: mud
      })
    } else {
      res.redirect('/ABS/enter-details')
    }
  })

  // gov uk pay page
  router.post('/ABS/gov-pay-1', function (req, res) {
    var scenario = req.session.scenario
    var paymentAmount = req.session.paymentAmount
    var payment = {}
    var errors = {}
    var errorFlag = false

    payment.cardNumber = req.body.cardNumber
    payment.expMonth = req.body.expMonth
    payment.expYear = req.body.expYear
    payment.fullName = req.body.fullName
    payment.securityCode = req.body.securityCode
    payment.buildingStreet = req.body.buildingStreet
    payment.buildingAndStreet = req.body.buildingAndStreet
    payment.townOrCity = req.body.townOrCity
    payment.postCode = req.body.postCode
    payment.emailAddress = req.body.emailAddress

    // VALIDATE USER INPUTS
    if (payment.cardNumber === '') {
      errors.cardNumber = {
        type: 'blank',
        msg: 'A card number is required',
        ref: 'card-number'
      }
      errorFlag = true
    } else if (payment.cardNumber.length < 16 || payment.cardNumber.length > 16) {
      errors.cardNumber = {
        type: 'invalid',
        msg: 'The card number must be 16 digits in length',
        ref: 'card-number'
      }
      errorFlag = true
    }

    if (payment.expMonth === '' || payment.expYear === '') {
      errors.expiry = {
        type: 'blank',
        msg: 'A card expiry month and year are required',
        ref: 'exp-month'
      }
      errorFlag = true
    }

    if (payment.fullName === '') {
      errors.fullName = {
        type: 'blank',
        msg: 'The name of the cardholder is required',
        ref: 'full-name'
      }
      errorFlag = true
    }

    if (payment.securityCode === '') {
      errors.securityCode = {
        type: 'blank',
        msg: 'A card security code is required',
        ref: 'security-number'
      }
      errorFlag = true
    }

    if (payment.buildingStreet === '') {
      errors.buildingStreet = {
        type: 'blank',
        msg: 'A building name and/or number and street is required',
        ref: 'building-street'
      }
      errorFlag = true
    }

    if (payment.townOrCity === '') {
      errors.townOrCity = {
        type: 'blank',
        msg: 'A town or city is required',
        ref: 'town-or-city'
      }
      errorFlag = true
    }

    if (payment.postCode === '') {
      errors.postCode = {
        type: 'blank',
        msg: 'A postcode is required',
        ref: 'postcode'
      }
      errorFlag = true
    }

    if (payment.emailAddress === '') {
      errors.emailAddress = {
        type: 'blank',
        msg: 'An email address is required',
        ref: 'email-address'
      }
      errorFlag = true
    }

    // CHECK ERROR FLAG
    if (errorFlag === true) {
      res.render('ABS/gov-pay-1', {
        errors: errors,
        scenario: scenario,
        payment: payment,
        paymentAmount: paymentAmount
      })
    } else {
      req.session.payment = payment
      res.redirect('gov-pay-2')
    }
  })

  // gov uk pay page
  router.get('/ABS/gov-pay-2', function (req, res) {
    var scenario = req.session.scenario
    var paymentAmount = req.session.paymentAmount
    var payment = ''

    if (scenario != null) {
      payment = req.session.payment
      res.render('ABS/gov-pay-2', {
        scenario: scenario,
        payment: payment,
        paymentAmount: paymentAmount
      })
    } else {
      res.redirect('/ABS/enter-details')
    }
  })

  // process complete
  router.get('/ABS/complete', function (req, res) {
    var scenario = req.session.scenario
    var payment = ''

    if (scenario != null) {
      payment = req.session.payment
      res.render('ABS/complete', {
        scenario: scenario,
        payment: payment
      })
    } else {
      res.redirect('/ABS/enter-details')
    }
  })
}
