# Connect the RSVP Form to Google Sheets + Email

This wires up your RSVP form (no backend server needed) using a free
**Google Apps Script Web App**. Every submission gets added as a row in a
Google Sheet, and an email notification is sent to
`drdeepthishibu@gmail.com`.

## Step 1 — Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **"Deepthi & Ashish — RSVPs"**.

## Step 2 — Add the script
1. In the Sheet, click **Extensions → Apps Script**.
2. Delete any placeholder code in the editor.
3. Open the file **`Code.gs`** (included alongside this guide) and paste its
   entire contents into the Apps Script editor.
4. Click the disk icon (or `Ctrl/Cmd + S`) to save. Name the project
   anything, e.g. "RSVP Backend".

## Step 3 — Deploy as a Web App
1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure:
   - **Description:** RSVP endpoint (or anything)
   - **Execute as:** **Me** (your Google account)
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Google will ask you to authorize the script — click **Authorize access**,
   choose your Google account, then click **Advanced → Go to (project
   name) → Allow**. This is expected since it's your own script.
6. Copy the **Web app URL** shown (it looks like
   `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`).

## Step 4 — Paste the URL into the site
1. Open `app.js`.
2. Find this line near the RSVP section:
   ```js
   var RSVP_ENDPOINT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder text with the URL you copied, e.g.:
   ```js
   var RSVP_ENDPOINT_URL = 'https://script.google.com/macros/s/XXXXXXXXXXXX/exec';
   ```
4. Save the file and re-upload/redeploy your site.

## Step 5 — Test it
1. Open your live site, fill out the RSVP form, and submit.
2. Check the Google Sheet — a new row should appear (a "RSVPs" tab is
   created automatically the first time someone submits).
3. Check the inbox for `drdeepthishibu@gmail.com` — you should receive a
   notification email with the guest's details.

## Notes
- If you ever need to update the script logic, edit `Code.gs` in the Apps
  Script editor, then **Deploy → Manage deployments → Edit (pencil icon) →
  New version → Deploy**. Just saving the file is not enough to update a
  live deployment.
- To change the notification email address, edit the `NOTIFY_EMAIL`
  variable at the top of `Code.gs` and redeploy as above.
- The email is sent from your own Google account (via `MailApp`), so it
  will land in the inbox reliably and won't look like spam.
- This is entirely free — Apps Script has generous free quotas well beyond
  what a wedding RSVP page would ever need.
- **Common deploy error:** if you hit a generic "An error occurred" popup
  when clicking Deploy, double check the editor actually contains the
  `Code.gs` script (not this guide!) and try refreshing the page before
  deploying again.
