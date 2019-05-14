var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.redirect('/start')
})

// Start page
router.get('/start', function (req, res) {
  var chAccountURL = process.env.CH_ACCOUNT_URL
  var serviceURL = process.env.SERVICE_URL

  req.session.destroy()
  res.render('start', {
    chAccountURL: chAccountURL,
    serviceURL: serviceURL
  })
})

// Lost your penalty notice
router.get('/lost-your-penalty-notice', function (req, res) {
  req.session.destroy()
  res.render('lost-your-penalty-notice')
})

// Enter details
router.get('/login', function (req, res) {
  req.session.accountEmail = req.query.accountEmail
  res.redirect('enter-details')
})

// Enter details
router.get('/enter-details', function (req, res) {
  res.render('enter-details', {
    accountEmail: req.session.accountEmail
  })
})

// Enter details
router.post('/enter-details', function (req, res) {
  var penalty = req.body.reference
  var companyno = req.body.companyno
  var penaltyErr = {}
  var companyErr = {}
  var errorFlag = false
  var scenario = {}
  var i = 0
  var j = 0
  var k = 0

  // VALIDATE USER INPUTS
  if (companyno.length < 8) {
    companyErr.type = 'invalid'
    companyErr.msg = 'You must enter your full eight character company number'
    companyErr.flag = true
    errorFlag = true
  }
  if (
    penalty !== '00012345' && // SINGLE PENALTY WITHOUT FEES
    penalty !== '00012346' && // SINGLE PAID PENALTY
    penalty !== '00012347' && // MULTIPLE PENALTY (1)
    penalty !== '00012348' && // MULTIPLE PENALTY (2)
    penalty !== '00012349' // SINGLE PENALTY WITH FEES
  ) {
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

  // TEST ERROR FLAG
  if (errorFlag === true) {
    res.render('enter-details', {
      penaltyErr: penaltyErr,
      companyErr: companyErr,
      penalty: penalty,
      companyno: companyno
    })
  } else {
    if (penalty === '00012345') {
      // SINGLE PENALTY WITHOUT FEES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'BATTERSEA POWER LIMITED',
        number: companyno
      }
      scenario.penalties = [
        {
          pen1: '00012345',
          periodStart: '1 May 2015',
          periodEnd: '30 April 2016',
          due: '1 January 2017',
          filed: '15 January 2017',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 150,
          fees: {},
          totalFees: 0,
          paid: false
        }
      ]

      req.session.scenario = scenario
      res.redirect('/view-penalties')
    } else if (penalty === '00012346') {
      // SINGLE PENALTY THAT HAS BEEN PAID
      scenario.entryRef = penalty
      scenario.company = {
        name: 'WILKINS GLAZING LIMITED',
        number: companyno
      }
      scenario.penalties = [
        {
          pen1: '00012346',
          periodStart: '1 May 2015',
          periodEnd: '30 April 2016',
          due: '1 January 2017',
          filed: '15 January 2017',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 150,
          fees: {},
          totalFees: 0,
          paid: true
        }
      ]

      req.session.scenario = scenario
      res.redirect('/penalty-has-been-paid')
    } else if (penalty === '00012347' || penalty === '00012348') {
      // MULTIPLE PENALTIES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'TEMPLETON METALWORK LIMITED',
        number: companyno
      }
      scenario.penalties = [
        {
          pen1: '00012347',
          periodStart: '1 May 2014',
          periodEnd: '30 April 2015',
          due: '1 January 2016',
          filed: '15 January 2016',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 150,
          fees: {
            solicitor: [
              {
                name: 'Solicitor fee',
                date: '23 April 2016',
                value: 50.00
              }
            ],
            court: [
              {
                name: 'Court fee',
                date: '23 April 2016',
                value: 25.00
              },
              {
                name: 'Hearing fee',
                date: '23 April 2016',
                value: 22.00
              }
            ]
          },
          totalFees: 0,
          paid: false
        },
        {
          pen1: '00012348',
          periodStart: '1 May 2015',
          periodEnd: '30 April 2016',
          due: '1 January 2017',
          filed: '15 January 2017',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 300,
          fees: {},
          totalFees: 0,
          paid: false
        }
      ]

      for (i = 0; i < scenario.penalties.length; i++) {
        if (scenario.penalties[i].fees.solicitor) {
          for (j = 0; j < scenario.penalties[i].fees.solicitor.length; j++) {
            scenario.penalties[i].totalFees += scenario.penalties[i].fees.solicitor[j].value
          }
        }
        if (scenario.penalties[i].fees.court) {
          for (k = 0; k < scenario.penalties[i].fees.court.length; k++) {
            scenario.penalties[i].totalFees += scenario.penalties[i].fees.court[k].value
          }
        }
      }

      req.session.scenario = scenario
      res.redirect('/view-penalties')
    } else if (penalty === '00012349') {
      // SINGLE PENALTY WITH FEES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'ROSEGOLD LIMITED',
        number: companyno
      }
      scenario.penalties = [
        {
          pen1: '00012349',
          periodStart: '1 May 2014',
          periodEnd: '30 April 2015',
          due: '1 January 2016',
          filed: '15 January 2016',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 150,
          fees: {
            solicitor: [
              {
                name: 'Solicitor fee',
                date: '23 April 2016',
                value: 50.00
              }
            ],
            court: [
              {
                name: 'Court fee',
                date: '23 April 2016',
                value: 25.00
              },
              {
                name: 'Hearing fee',
                date: '23 April 2016',
                value: 22.00
              }
            ]
          },
          totalFees: 0,
          paid: false
        }
      ]

      for (i = 0; i < scenario.penalties.length; i++) {
        if (scenario.penalties[i].fees.solicitor) {
          for (j = 0; j < scenario.penalties[i].fees.solicitor.length; j++) {
            scenario.penalties[i].totalFees += scenario.penalties[i].fees.solicitor[j].value
          }
        }
        if (scenario.penalties[i].fees.court) {
          for (k = 0; k < scenario.penalties[i].fees.court.length; k++) {
            scenario.penalties[i].totalFees += scenario.penalties[i].fees.court[k].value
          }
        }
      }

      req.session.scenario = scenario
      res.redirect('/view-penalties')
    }
  }
})

// Restart journey if no scenario is loaded into the session
router.all('*', function (req, res, next) {
  if (typeof req.session.scenario === 'undefined') {
    return res.redirect('/start')
  }
  next()
})

// View details of a single penalty
router.get('/view-penalties', function (req, res) {
  var scenario = req.session.scenario
  var entryRef = ''
  var totalDue = 0

  if (scenario != null) {
    entryRef = scenario.entryRef

    for (var i = 0; i < scenario.penalties.length; i++) {
      totalDue += (scenario.penalties[i].value + scenario.penalties[i].totalFees)
    }

    req.session.totalDue = totalDue
    res.render('view-penalties', {
      scenario: scenario,
      totalDue: totalDue,
      entryRef: entryRef
    })
  } else {
    res.redirect('/start')
  }
})

// View details of a single penalty
router.get('/payment-service', function (req, res) {
  var scenario = req.session.scenario
  var entryRef = ''
  var totalDue = 0
  var payLink = ''
  var env = (process.env.NODE_ENV || 'development').toLowerCase()

  if (scenario != null) {
    entryRef = scenario.entryRef

    for (var i = 0; i < scenario.penalties.length; i++) {
      totalDue += (scenario.penalties[i].value + scenario.penalties[i].totalFees)
    }

    // Pay Link
    if (env === 'development') {
      if (scenario.entryRef === '00012345') {
        payLink = process.env.BPL_REDIRECT
      } else if (scenario.entryRef === '00012347' || scenario.entryRef === '00012348') {
        payLink = process.env.TML_REDIRECT
      }
    } else {
      if (scenario.entryRef === '00012345') {
        payLink = process.env.BPL_PAY
      } else if (scenario.entryRef === '00012347' || scenario.entryRef === '00012348') {
        payLink = process.env.TML_PAY
      }
    }

    req.session.totalDue = totalDue
    res.render('payment-service', {
      scenario: scenario,
      totalDue: totalDue,
      entryRef: entryRef,
      payLink: payLink,
      env: env
    })
  } else {
    res.redirect('/enter-details')
  }
})

// View details of a single penalty
router.get('/penalty-has-been-paid', function (req, res) {
  var scenario = req.session.scenario
  var entryRef = ''
  var totalDue = 0

  if (scenario != null) {
    entryRef = scenario.entryRef

    for (var i = 0; i < scenario.penalties.length; i++) {
      totalDue += (scenario.penalties[i].value + scenario.penalties[i].totalFees)
    }

    req.session.totalDue = totalDue
    res.render('penalty-has-been-paid', {
      scenario: scenario,
      totalDue: totalDue,
      entryRef: entryRef
    })
  } else {
    res.redirect('/enter-details')
  }
})

// gov uk pay page
router.get('/card-details', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue

  if (scenario != null) {
    res.render('card-details', {
      scenario: scenario,
      totalDue: totalDue
    })
  } else {
    res.redirect('/enter-details')
  }
})

// gov uk pay page
router.post('/card-details', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue
  var payment = {}
  var errors = {}
  var errorFlag = false

  payment.cardNumber = req.body.cardNumber.replace(/\s+/g, '')
  payment.expiryMonth = req.body.expiryMonth
  payment.expiryYear = req.body.expiryYear
  payment.fullName = req.body.fullName
  payment.securityCode = req.body.securityCode
  payment.country = req.body.country
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

  if (payment.expiryMonth === '' || payment.expiryYear === '') {
    errors.expiry = {
      type: 'blank',
      msg: 'A card expiry month and year are required',
      ref: 'expiry-month'
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
      ref: 'card-security-number'
    }
    errorFlag = true
  }

  if (payment.country === '') {
    errors.country = {
      type: 'blank',
      msg: 'A country is required',
      ref: 'country'
    }
    errorFlag = true
  }

  if (payment.buildingStreet === '') {
    errors.buildingStreet = {
      type: 'blank',
      msg: 'A building name and/or number and street is required',
      ref: 'building-number'
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

  // hybridECK ERROR FLAG
  if (errorFlag === true) {
    res.render('card-details', {
      errors: errors,
      scenario: scenario,
      totalDue: totalDue,
      payment: payment
    })
  } else {
    req.session.payment = payment
    if (scenario.company.number === '12345678') {
      res.redirect('payment-confirmation')
    } else {
      res.redirect('review-payment')
    }
  }
})

// gov uk pay page
router.get('/review-payment', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue
  var payment = ''

  if (scenario != null) {
    payment = req.session.payment
    res.render('review-payment', {
      scenario: scenario,
      payment: payment,
      totalDue: totalDue
    })
  } else {
    res.redirect('/enter-details')
  }
})

// process complete
router.get('/payment-confirmation', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue
  var payment = ''

  if (scenario != null) {
    payment = req.session.payment

    // Send confirmation email
    if (process.env.POSTMARK_API_KEY) {
      var postmark = require('postmark')
      var client = new postmark.Client(process.env.POSTMARK_API_KEY)

      client.sendEmailWithTemplate({
        'From': 'owilliams@companieshouse.gov.uk',
        'To': 'test.user.lfp@gmail.com',
        'TemplateId': process.env.ETID_CONFIRMATION,
        'TemplateModel': {
          'scenario': scenario,
          'payment': payment,
          'totalPaid': totalDue
        }
      }, function (error, success) {
        if (error) {
          console.error('Unable to send via postmark: ' + error.message)
        }
      })
    } else {
      console.log('No Postmark API key detected. To test emails run app locally with `heroku local web`')
    }

    res.render('payment-confirmation', {
      scenario: scenario,
      payment: payment
    })
  } else {
    res.redirect('/enter-details')
  }
})

// Localhost redirect for GOV.UK Pay
// // This redirect is only used by the DEV Heroku instance. It allows the DEV
// // instance to support live redirects from GOV.UK Pay back to your local port
router.get('/local-redirect', function (req, res) {
  res.redirect('http://localhost:3344/payment-confirmation')
})
router.post('/local-redirect', function (req, res) {
  res.redirect('http://localhost:3344/payment-confirmation')
})

module.exports = router
