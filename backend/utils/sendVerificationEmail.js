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

export async function sendVerifyEmail(token, email, username) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Hello ${username},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationLink}"
             style="
               display: inline-block;
               padding: 10px 20px;
               color: #ffffff;
               background-color: #4CAF50;
               text-decoration: none;
               border-radius: 5px;
             ">
            Verify Email
          </a>
          <p>If you did not create this account, please ignore this email.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("EMAIL_SEND_FAILED");
  }
}
