/**
 * Deepthi & Ashish Wedding — RSVP backend
 * -----------------------------------------------------------------------
 * Deploy this as a Google Apps Script Web App (see GOOGLE_SHEET_SETUP.md
 * for step-by-step instructions). It will:
 *   1. Append every RSVP submission as a new row in this Sheet.
 *   2. Send a notification email to NOTIFY_EMAIL with the guest's response.
 * -----------------------------------------------------------------------
 */

var NOTIFY_EMAIL = 'drdeepthishibu@gmail.com';
var SHEET_NAME = 'RSVPs';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var name = (data.name || '').toString().trim();
    var phone = (data.phone || '').toString().trim();
    var guests = (data.guests || '').toString().trim();
    var attending = (data.attending || '').toString().trim();
    var message = (data.message || '').toString().trim();

    var attendingLabel = {
      wedding: 'Joyfully Accepts — Wedding',
      reception: 'Joyfully Accepts — Reception',
      both: 'Joyfully Accepts — Both',
      no: 'Regretfully Declines'
    }[attending] || attending;

    // 1. Save to the Sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Guests', 'Attending', 'Message']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    sheet.appendRow([new Date(), name, phone, guests, attendingLabel, message]);

    // 2. Email notification
    var subject = 'New Wedding RSVP: ' + (name || 'Someone') + ' — ' + attendingLabel;
    var body =
      'A new RSVP has been submitted on the wedding site.\n\n' +
      'Name: ' + name + '\n' +
      'Phone: ' + phone + '\n' +
      'Guests: ' + guests + '\n' +
      'Response: ' + attendingLabel + '\n' +
      'Message: ' + (message || '(none)') + '\n\n' +
      'View all responses: ' + ss.getUrl();

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: lets you open the Web App URL directly in a browser to confirm
 * it's live (it won't record anything, just a friendly check message).
 */
function doGet(e) {
  return ContentService.createTextOutput('RSVP endpoint is live. Submit via POST.');
}
