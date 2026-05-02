const welcomeEmailHtml = (name = "User") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to TaskMaster Pro</title>
</head>
<body style="margin:0; padding:0; background:#f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background:#2563eb; padding: 30px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">🚀 Welcome to TaskMaster Pro</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin-top:0; color:#111827;">Hey ${name},</h2>
              <p style="color:#4b5563; font-size:16px; line-height:1.6;">
                You're officially in. 🎉 Your productivity journey starts now.
              </p>
              <p style="color:#4b5563; font-size:16px; line-height:1.6;">With <strong>TaskMaster Pro</strong>, you can:</p>
              <ul style="color:#4b5563; font-size:15px; line-height:1.8; padding-left:20px;">
                <li>✔ Manage tasks and projects effortlessly</li>
                <li>✔ Collaborate with your team seamlessly</li>
                <li>✔ Track progress and hit your goals</li>
              </ul>
              <!-- CTA -->
              <div style="text-align:center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || '#'}/dashboard"
                   style="background:#2563eb; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:600; display:inline-block;">
                  Go to Dashboard →
                </a>
              </div>
              <p style="color:#9ca3af; font-size:14px;">
                Tip: Set up 2-Factor Authentication in Settings for extra security 🔐
              </p>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #e5e7eb;">
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:30px; text-align:center; font-size:12px; color:#9ca3af;">
              © ${new Date().getFullYear()} TaskMaster Pro. All rights reserved.<br/>
              Supercharge your workflow.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const welcomeEmailPlainText = (name = "User") => `
Welcome to TaskMaster Pro 🎉

Hey ${name},

You're officially in! Your productivity journey starts now.

What you can do:
- Manage tasks and projects effortlessly
- Collaborate with your team seamlessly
- Track progress and hit your goals

Get started: ${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard

Tip: Enable 2FA in Settings for extra security.

— TaskMaster Pro Team
`;

export { welcomeEmailHtml, welcomeEmailPlainText };
