var express = require('express')
var router = express.Router()
var penaltyGroups = [
  [
    {
      pen1: 'PEN1A/12345677',
      pen2: 'PEN2A/12345677',
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
  ],
  [
    {
      pen1: 'PEN1A/12345678',
      pen2: 'PEN2A/12345678',
      periodStart: '1 May 2013',
      periodEnd: '30 April 2014',
      due: '1 January 2015',
      filed: '15 January 2015',
      overdue: '14 days',
      band: 'Up to 1 month overdue',
      value: 150,
      fees: {
        solicitor: [
          {
            name: 'Solicitor fee',
            date: '23 April 2015',
            value: 50.00
          }
        ],
        court: [
          {
            name: 'Court fee',
            date: '23 April 2015',
            value: 25.00
          },
          {
            name: 'Hearing fee',
            date: '23 April 2015',
            value: 22.00
          }
        ]
      },
      totalFees: 0
    },
    {
      pen1: 'PEN1A/12345679',
      pen2: 'PEN2A/12345679',
      periodStart: '1 May 2014',
      periodEnd: '30 April 2015',
      due: '1 January 2016',
      filed: '15 January 2016',
      overdue: '14 days',
      band: 'Up to 1 month overdue',
      value: 300,
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
      totalFees: 0
    },
    {
      pen1: 'PEN1A/12345670',
      pen2: 'PEN2A/12345670',
      periodStart: '1 May 2015',
      periodEnd: '30 April 2016',
      due: '1 January 2017',
      filed: '15 January 2017',
      overdue: '14 days',
      band: 'Up to 1 month overdue',
      value: 300,
      fees: {},
      totalFees: 0
    }
  ]
]

// Route index page
router.get('/', function (req, res) {
  req.session.destroy()
  res.render('index')
})

router.post('/', function (req, res) {
  if (req.body.version) {
    req.session.version = req.body.version
    res.redirect('/start')
  } else {
    res.render('index')
  }
})

// Start page
router.get('/start', function (req, res) {
  // req.session.destroy()
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
  var penaltyConv = penalty.toUpperCase()

  // VALIDATE USER INPUTS
  if (companyno.length < 8) {
    companyErr.type = 'invalid'
    companyErr.msg = 'You must enter your full eight character company number'
    companyErr.flag = true
    errorFlag = true
  }
  if (
    penaltyConv !== 'PEN1A/12345677' &&
    penaltyConv !== 'PEN2A/12345677' &&
    penaltyConv !== 'PEN1A/12345678' &&
    penaltyConv !== 'PEN2A/12345678' &&
    penaltyConv !== 'PEN1A/12345679' &&
    penaltyConv !== 'PEN2A/12345679' &&
    penaltyConv !== 'PEN1A/12345670'
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
    if (penaltyConv === 'PEN1A/12345677' || penaltyConv === 'PEN2A/12345677') {
      // SINGLE PENALTY WITH FEES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'BATTERSEA POWER LIMITED',
        number: companyno
      }
      scenario.penalties = [
        {
          pen1: 'PEN1A/12345677',
          pen2: 'PEN2A/12345677',
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
      res.redirect('/view-penalties')
    } else if (penaltyConv === 'PEN1A/12345678' || penaltyConv === 'PEN2A/12345678' || penaltyConv === 'PEN1A/123456789' || penaltyConv === 'PEN2A/123456789' || penaltyConv === 'PEN1A/123456780') {
      // MULTIPLE PENALTIES
      scenario.entryRef = penalty
      scenario.company = {
        name: 'BATTERSEA POWER LIMITED',
        number: companyno
      }
      scenario.penalties = [
        {
          pen1: 'PEN1A/12345678',
          pen2: 'PEN2A/12345678',
          periodStart: '1 May 2013',
          periodEnd: '30 April 2014',
          due: '1 January 2015',
          filed: '15 January 2015',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 150,
          fees: {
            solicitor: [
              {
                name: 'Solicitor fee',
                date: '23 April 2015',
                value: 50.00
              }
            ],
            court: [
              {
                name: 'Court fee',
                date: '23 April 2015',
                value: 25.00
              },
              {
                name: 'Hearing fee',
                date: '23 April 2015',
                value: 22.00
              }
            ]
          },
          totalFees: 0
        },
        {
          pen1: 'PEN1A/12345679',
          pen2: 'PEN2A/12345679',
          periodStart: '1 May 2014',
          periodEnd: '30 April 2015',
          due: '1 January 2016',
          filed: '15 January 2016',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 300,
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
          totalFees: 0
        },
        {
          pen1: 'PEN1A/12345670',
          pen2: '',
          periodStart: '1 May 2015',
          periodEnd: '30 April 2016',
          due: '1 January 2017',
          filed: '15 January 2017',
          overdue: '14 days',
          band: 'Up to 1 month overdue',
          value: 300,
          fees: {},
          totalFees: 0
        }
      ]

      for (var i = 0; i < scenario.penalties.length; i++) {
        if (scenario.penalties[i].fees.solicitor) {
          for (var j = 0; j < scenario.penalties[i].fees.solicitor.length; j++) {
            scenario.penalties[i].totalFees += scenario.penalties[i].fees.solicitor[j].value
          }
        }
        if (scenario.penalties[i].fees.court) {
          for (var k = 0; k < scenario.penalties[i].fees.court.length; k++) {
            scenario.penalties[i].totalFees += scenario.penalties[i].fees.court[k].value
          }
        }
      }

      req.session.scenario = scenario
      res.redirect('/view-penalties')
    }
  }
})

// View details of a single penalty
router.get('/view-penalties', function (req, res) {
  var scenario = req.session.scenario
  var version = req.session.version
  var totalDue = 0

  if (scenario != null) {
    for (var i = 0; i < scenario.penalties.length; i++) {
      totalDue += (scenario.penalties[i].value + scenario.penalties[i].totalFees)
    }

    req.session.totalDue = totalDue
    res.render('view-penalties', {
      scenario: scenario,
      version: version,
      totalDue: totalDue
    })
  } else {
    res.redirect('/enter-details')
  }
})

// View details of a single penalty
router.get('/view-penalty', function (req, res) {
  var scenario = req.session.scenario
  var pen1 = req.query.pen1
  var pen2 = req.query.pen2

  if (scenario != null) {
    res.render('view-penalty', {
      scenario: scenario,
      pen1: pen1,
      pen2: pen2
    })
  } else {
    res.redirect('/enter-details')
  }
})

// gov uk pay page
router.get('/gov-pay-1', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue

  if (scenario != null) {
    res.render('gov-pay-1', {
      scenario: scenario,
      totalDue: totalDue
    })
  } else {
    res.redirect('/enter-details')
  }
})

// gov uk pay page
router.post('/gov-pay-1', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue
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
      totalDue: totalDue,
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
  var totalDue = req.session.totalDue
  var payment = ''

  if (scenario != null) {
    payment = req.session.payment
    res.render('gov-pay-2', {
      scenario: scenario,
      payment: payment,
      totalDue: totalDue
    })
  } else {
    res.redirect('/enter-details')
  }
})

// process complete
router.get('/complete', function (req, res) {
  var scenario = req.session.scenario
  var totalDue = req.session.totalDue
  var payment = ''
  // var totalPaid = 0

  if (scenario != null) {
    payment = req.session.payment
    // totalPaid = (scenario.penalties[0].value + scenario.penalties[0].totalFees)

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
          'totalPaid': totalDue
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
