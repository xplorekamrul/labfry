import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});
export async function sendOTP(to: string, code: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to,
    subject: "Your Labfry verification code",
    html: `<h2>Your verification code</h2>
           <div style="font-size:26px;letter-spacing:8px;"><b>${code}</b></div>
           <p>Expires in 10 minutes.</p>`,
  });
}
export async function sendResetLink(to: string, link: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM!,
    to,
    subject: "Reset your Labfry password",
    html: `<p>Click to reset your password:</p><p><a href="${link}">${link}</a></p><p>Expires in 30 minutes.</p>`,
  });
}
