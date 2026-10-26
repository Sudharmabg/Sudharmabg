/**
 * Portfolio contact form backend (Google Apps Script web app).
 *
 * For every valid submission it:
 *   1. appends a row to the "Messages" sheet of the spreadsheet this script is bound to, and
 *   2. emails the details to NOTIFY_EMAIL (Reply-To = the sender, so you can answer in one click).
 * Setup steps: apps-script/README.md
 */

const NOTIFY_EMAIL = 'bgsudharma1998@gmail.com'; // where new messages are sent
const SHEET_NAME = 'Messages';
const TIME_ZONE = 'Asia/Kolkata';
const LIMITS = { name: 100, email: 200, message: 3000 };
const RATE_LIMIT_SECONDS = 60; // one message per email address per minute

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: real visitors never see or fill the "company" field.
    if (data.company) return json({ ok: true });

    const name = clean(data.name, LIMITS.name);
    const email = clean(data.email, LIMITS.email);
    const message = clean(data.message, LIMITS.message);
    const page = clean(data.page, 300);

    if (!name || message.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'invalid' });
    }

    const cache = CacheService.getScriptCache();
    const key = 'rl:' + email.toLowerCase();
    if (cache.get(key)) return json({ ok: false, error: 'rate_limited' });
    cache.put(key, '1', RATE_LIMIT_SECONDS);

    const now = new Date();
    const when = Utilities.formatDate(now, TIME_ZONE, "d MMM yyyy, h:mm a 'IST'");

    getSheet().appendRow([now, name, email, message, page]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      name: 'Portfolio contact form',
      subject: 'New message from ' + name + ' via your portfolio',
      body: [
        'New message from your portfolio contact form',
        '',
        'Name:    ' + name,
        'Email:   ' + email,
        'Sent:    ' + when,
        'Page:    ' + page,
        '',
        message,
        '',
        '— Reply to this email to answer ' + name + ' directly.',
      ].join('\n'),
      htmlBody: emailHtml({ name: name, email: email, message: message, page: page, when: when }),
    });

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
}

// Lets you open the web app URL in a browser to confirm the deployment is live.
function doGet() {
  return json({ ok: true, service: 'portfolio-contact' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Received (IST)', 'Name', 'Email', 'Message', 'Page']);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('d mmm yyyy, h:mm am/pm');
    sheet.setColumnWidth(4, 420);
    sheet.getRange('D:D').setWrap(true);
  }
  ss.setSpreadsheetTimeZone(TIME_ZONE);
  return sheet;
}

function emailHtml(m) {
  const row = function (label, value) {
    return '<tr><td style="padding:6px 16px 6px 0;color:#8a8a8a;font:12px monospace;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">' +
      label + '</td><td style="padding:6px 0;color:#111;font:15px Arial,sans-serif">' + value + '</td></tr>';
  };
  return (
    '<div style="max-width:560px;font-family:Arial,sans-serif">' +
    '<p style="font:600 18px Arial,sans-serif;margin:0 0 16px">New message from your portfolio</p>' +
    '<table style="border-collapse:collapse;margin-bottom:16px">' +
    row('Name', esc(m.name)) +
    row('Email', '<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>') +
    row('Sent', esc(m.when)) +
    row('Page', esc(m.page)) +
    '</table>' +
    '<div style="white-space:pre-wrap;padding:16px;background:#f5f5f2;border-left:3px solid #9ccf1f;font:15px/1.6 Arial,sans-serif;color:#111">' +
    esc(m.message) +
    '</div>' +
    '<p style="color:#8a8a8a;font:13px Arial,sans-serif;margin-top:16px">Reply to this email to answer ' + esc(m.name) + ' directly.</p>' +
    '</div>'
  );
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function clean(value, max) {
  return String(value || '').trim().slice(0, max);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
