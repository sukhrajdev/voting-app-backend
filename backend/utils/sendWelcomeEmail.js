import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendWelcomeEmail(email,username) {
    try {
        const info = transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Welcome to Our Voting Site Thanks for registeration",
            html: `
            <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 0;">
              <table width="600" cellpadding="0" cellspacing="0"
                style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

                <!-- Header -->
                <tr>
                  <td style="background:#1e40af; padding:20px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0;">Welcome, ${username} 🎉</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <p style="font-size:16px; line-height:1.6;">
                      Hello <strong>${username}</strong>,
                    </p>

                    <p style="font-size:16px; line-height:1.6;">
                      Thank you for registering on our <strong>Online Voting Platform</strong>.
                      Your account has been created successfully.
                    </p>

                    <p style="font-size:16px; line-height:1.6;">
                      ⚠️ <strong>Important:</strong> We have sent you another email containing a
                      <strong>verification link</strong>.  
                      Please verify your email address to activate your account and access all features.
                    </p>

                    <p style="font-size:16px; line-height:1.6;">
                      If you do not see the verification email, please check your
                      <strong>Spam</strong> or <strong>Promotions</strong> folder.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <span style="background:#e0e7ff; color:#1e40af; padding:12px 20px; border-radius:6px; font-size:15px;">
                        Verify your email to continue
                      </span>
                    </div>

                    <p style="font-size:14px; color:#666666;">
                      If you did not create this account, please ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f1f5f9; padding:20px; text-align:center; font-size:13px; color:#666666;">
                    © ${new Date().getFullYear()} Online Voting System. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
            `
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occured while sending Welcome Mail",
            error: err.message
        })
    }
    
}