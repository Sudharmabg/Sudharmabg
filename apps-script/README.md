# Contact form backend: Google Sheets + Gmail

When a visitor sends the contact form:
1. They see a **"Message sent"** confirmation on the site.
2. A new row (time in IST, name, email, message, page) is added to your Google Sheet.
3. You get an **email at bgsudharma1998@gmail.com** with all the details. Hit Reply to answer the visitor directly.

It runs on a free Google Apps Script web app. Setup takes about 5 minutes.

## 1. Create the sheet and script
1. Go to [sheets.new](https://sheets.new) and name the sheet, e.g. **"Portfolio messages"**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete what's in `Code.gs`, paste in [`Code.gs`](./Code.gs) from this folder, and click **Save**.
4. To get notifications at a different address, change `NOTIFY_EMAIL` at the top of the script.

## 2. Deploy it as a web app
1. Click **Deploy → New deployment**.
2. Under **Select type**, choose **Web app**.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**. This is required so the website can post to it; the script only accepts the form's fields.
5. Click **Deploy**. Google asks you to authorise access to Sheets, sending email as you, and the cache. If it says *"Google hasn't verified this app"*, choose **Advanced → Go to (project) (unsafe)**. That's normal for your own script.
6. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/…/exec`.

Opening that URL in a browser should show `{"ok":true,"service":"portfolio-contact"}`.

## 3. Connect the site
**Locally:** create a file named `.env.local` in the project root (it is git-ignored) containing the line below, then restart `npm run dev`.

```
VITE_CONTACT_ENDPOINT=https://script.google.com/macros/s/…/exec
```

**On Vercel:** go to Project → Settings → Environment Variables and add `VITE_CONTACT_ENDPOINT` with the same URL, then redeploy. The URL is baked in at build time, so a redeploy is required.

Until the variable is set, the form shows *"The form isn't connected yet"* with your email address, instead of failing silently.

## 4. Test it
Send yourself a message from the site. You should see the "Message sent" panel, a new row in the sheet, and an email within a minute. Check Spam the first time.

## Updating the script later
Edit `Code.gs`, then use **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. This keeps the same URL; creating a *new* deployment gives you a different URL.

## Built-in protections
- **Honeypot:** a hidden `company` field. Bots fill it, and those submissions are silently dropped.
- **Rate limit:** one message per email address per minute.
- **Length caps:** name 100 characters, email 200, message 3000.
