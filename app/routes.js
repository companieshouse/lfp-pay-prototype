var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  req.session.destroy()
  res.render('start')
})

// Start page
router.get('/start', function (req, res) {
  req.session.destroy()
  res.render('start')
})

// Enter details
router.get('/enter-details', function (req, res) {
  res.render('enter-details')
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

  // VALIDATE USER INPUTS
  if (companyno.length < 8) {
    companyErr.type = 'invalid'
    companyErr.msg = 'You must enter your full eight character company number'
    companyErr.flag = true
    errorFlag = true
  }
  if (penalty !== 'PEN2A/12345678' && penalty !== 'PEN2B/12345678') {
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
    if (penalty === 'PEN2A/12345678') {
      // SINGLE PENALTY WITH FEES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'XYZ ARCHITECTS LIMITED',
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
            solicitor: [
              {
                name: 'Solicitor fee',
                date: '9 April 2016',
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
          totalFees: 0
        }
      ]

      for (i = 0; i < scenario.penalties[0].fees.solicitor.length; i++) {
        scenario.penalties[0].totalFees += scenario.penalties[0].fees.solicitor[i].value
      }

      for (i = 0; i < scenario.penalties[0].fees.court.length; i++) {
        scenario.penalties[0].totalFees += scenario.penalties[0].fees.court[i].value
      }

      req.session.scenario = scenario
      res.redirect('/view-penalty')
    } else if (penalty === 'PEN2B/12345678') {
      // MULTIPLE PENALTIES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'BATTERSEA POWER LIMITED',
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
            solicitor: [
              {
                name: 'Solicitor fee',
                date: '9 April 2016',
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
          totalFees: 0
        }
      ]

      for (i = 0; i < scenario.penalties[0].fees.solicitor.length; i++) {
        scenario.penalties[0].totalFees += scenario.penalties[0].fees.solicitor[i].value
      }

      for (i = 0; i < scenario.penalties[0].fees.court.length; i++) {
        scenario.penalties[0].totalFees += scenario.penalties[0].fees.court[i].value
      }

      req.session.scenario = scenario
      res.redirect('/view-penalty')
    }
  }
})

// View details of a single penalty
router.get('/view-penalty', function (req, res) {
  var scenario = req.session.scenario

  if (scenario != null) {
    res.render('view-penalty', {
      scenario: scenario
    })
  } else {
    res.redirect('/enter-details')
  }
})

// gov uk pay page
router.get('/gov-pay-1', function (req, res) {
  var scenario = req.session.scenario

  if (scenario != null) {
    res.render('gov-pay-1', {
      scenario: scenario
    })
  } else {
    res.redirect('/enter-details')
  }
})

// gov uk pay page
router.post('/gov-pay-1', function (req, res) {
  var scenario = req.session.scenario
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

  // hybridECK ERROR FLAG
  if (errorFlag === true) {
    res.render('gov-pay-1', {
      errors: errors,
      scenario: scenario,
      payment: payment
    })
  } else {
    req.session.payment = payment
    res.redirect('gov-pay-2')
  }
})

// gov uk pay page
router.get('/gov-pay-2', function (req, res) {
  var scenario = req.session.scenario
  var payment = ''

  if (scenario != null) {
    payment = req.session.payment
    res.render('gov-pay-2', {
      scenario: scenario,
      payment: payment
    })
  } else {
    res.redirect('/enter-details')
  }
})

// process complete
router.get('/complete', function (req, res) {
  var scenario = req.session.scenario
  var payment = ''
  var totalPaid = 0

  if (scenario != null) {
    payment = req.session.payment
    totalPaid = (scenario.penalties[0].value + scenario.penalties[0].totalFees)

    // Send confirmation email

    if (process.env.POSTMARK_API_KEY) {
      var postmark = require('postmark')
      var client = new postmark.Client(process.env.POSTMARK_API_KEY)

      client.sendEmailWithTemplate({
        'From': 'owilliams@companieshouse.gov.uk',
        'To': payment.emailAddress,
        'TemplateId': process.env.ETID_CONFIRMATION,
        'TemplateModel': {
          'scenario': scenario,
          'payment': payment,
          'totalPaid': totalPaid
        }
      }, function (error, success) {
        if (error) {
          console.error('Unable to send via postmark: ' + error.message)
          return
        }
      })
    } else {
      console.log('No Postmrk API key detected. To test emails run app locally with `heroku local web`')
    }

    res.render('complete', {
      scenario: scenario,
      payment: payment
    })
  } else {
    res.redirect('/enter-details')
  }
})

module.exports = router
