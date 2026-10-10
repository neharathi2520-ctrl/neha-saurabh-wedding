/**
 * Receives RSVPs from the form on the website and adds them to a "Website RSVPs" tab.
 *
 * Setup (once):
 *   1. Open the RSVP responses Google Sheet (SHEET_ID below) → Extensions → Apps Script.
 *   2. Replace the editor contents with this file and click Save.
 *   3. Deploy → New deployment → type "Web app".
 *      Execute as: Me.  Who has access: Anyone.  → Deploy, and approve the permissions.
 *   4. Copy the Web app URL (ends in /exec) into RSVP_ENDPOINT in the CONFIG block of index.html.
 * After editing this script, use Deploy → Manage deployments → edit → Version: New version,
 * so the /exec URL stays the same.
 */
// The "Saurabh & Neha - Wedding RSVP" responses Sheet: docs.google.com/spreadsheets/d/<SHEET_ID>/edit
const SHEET_ID = '1iP9dA5g4uEA784CdUKX9rcXA4pKz8fjENKeujv-x77k';
const TAB = 'Website RSVPs';
const COLUMNS = [
  ['Timestamp', null],
  ['Name', 'name'],
  ['Can you attend?', 'attending'],
  ['Which side', 'side'],
  ['Phone', 'phone'],
  ['Number of guests', 'guests'],
  ['Events attending', 'events'],
  ['Arrival date & time', 'arrival'],
];

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: 'bad request' });
  }
  if (data.website) return reply({ ok: true }); // honeypot field filled in: a bot
  const name = clean(data.name);
  if (!name || !clean(data.attending)) return reply({ ok: false, error: 'missing fields' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB);
    if (!sheet) {
      sheet = ss.insertSheet(TAB);
      sheet.appendRow(COLUMNS.map(c => c[0]));
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(COLUMNS.map(([, key]) => {
      if (!key) return new Date();
      const v = data[key];
      return clean(Array.isArray(v) ? v.join(', ') : v);
    }));
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

function clean(v) {
  // a leading = + - @ would make Sheets treat a guest's answer as a formula
  return String(v == null ? '' : v).trim().slice(0, 500).replace(/^[=+\-@]/, "'$&");
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
