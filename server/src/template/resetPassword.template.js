export const resetPasswordHtml = (name, link) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f4f7; font-family: Arial, Helvetica, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .header { background: #2563eb; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; letter-spacing: .5px; }
    .body { padding: 40px; }
    .body p { color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: 600; }
    .notice { font-size: 13px; color: #6b7280; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; }
    .footer p { margin: 0; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header"><h1>TaskMaster Pro</h1></div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We received a request to reset the password for your TaskMaster Pro account. Click the button below to choose a new password:</p>
      <div style="text-align:center;">
        <a href="${link}" class="btn">Reset Password</a>
      </div>
      <p class="notice">This link is valid for <strong>10 minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} TaskMaster Pro. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const resetPasswordPlainText = (name, link) =>
  `Hi ${name},\n\nWe received a request to reset your TaskMaster Pro password.\n\nReset link (valid for 10 minutes):\n${link}\n\nIf you didn't request this, you can safely ignore this email.\n\n— The TaskMaster Pro Team`;
