/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()

  $('#card-number').on('input', function (e) {
    if ($('#card-number').val() === '0000') {
      $('#card-number').val('4444333322221111')
      $('#expiry-month').val('10')
      $('#expiry-year').val('17')
      $('#full-name').val('Mr James Martin')
      $('#card-security-number').val('123')
      $('#country').val('United Kingdom')
      $('#building-number').val('10 Cardiff Road')
      $('#town-or-city').val('Cardiff')
      $('#postcode').val('CF83 7JN')
      $('#email-address').val('test.user.lfp@gmail.com')
    }
  })
})
