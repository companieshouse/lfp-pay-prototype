/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
  window.sessionStorage.setItem('prototypeWarning', true)
}

$(document).ready(function () {
  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']")
  new GOVUK.SelectionButtons($blockLabels) // eslint-disable-line

  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()

  $('#card-number').on('input', function (e) {
    if ($('#card-number').val() === '0000') {
      $('#card-number').val('4444333322221111')
      $('#exp-month').val('10')
      $('#exp-year').val('17')
      $('#full-name').val('Mr James Martin')
      $('#security-number').val('123')
      $('#building-street').val('10 Cardiff Road')
      $('#town-or-city').val('Cardiff')
      $('#postcode').val('CF83 7JN')
      $('#email-address').val('test.user.lfp@gmail.com')
    }
  })
})
