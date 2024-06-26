
const nodemailer = require('nodemailer');
require('dotenv').config();



async function sendWelcomeEmail(to, employeeId, password) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GOOGLE_APP_PASS,
    },
  });


  const mailOptions = {
    from: {
      name: 'staffClock',
      address: process.env.GMAIL_ADDRESS,
    },
    to,
    subject: 'Welcome to the Team!',
    text: `Hey! Congratulations on your new job. We're excited to have you on board! 

    In this email, you'll find your login credentials:

    - Employee ID: ${employeeId}
    - Password: ${password}

    Please note that the password provided is temporary and must be changed upon your first login. You can easily change it by following these steps: profile change password

    We believe you'll have a great career here at your new role. Don't hesitate to reach out to your manager or HR representative if you have any questions.

    Welcome aboard!

    Best regards,
    The staffClocl Team

    P.S. We're excited to see what you'll accomplish! Don't forget to join our community using this link.`,
    html: `Hey! <span style="color: #336699; font-weight: bold;">Congratulations on your new job</span>. We're excited to have you on board! 
    <p style="color: red; font-weight: bold;">Warning: Do not share these login credentials with others. This information is confidential.</p>

    <p>In this email, you'll find your login credentials:</p>

    <ul>
      <li><span style="color: #336699;">Employee ID:</span> ${employeeId}</li>
      <li><span style="color: #336699;">Password:</span> ${password}</li>
    </ul>
    <p>Please note that the password provided is temporary and must be changed upon your first login. You can easily change it by following these steps: from profile change password</p>

    <p>We believe you'll have a great career here at your new role. Don't hesitate to reach out to your manager or HR representative if you have any questions.</p>

    <p>Welcome aboard!</p>

    <p><span style="color: #336699; font-style: italic;">Best regards,</span></p>
    <p><span style="color: #336699; font-weight: bold;">The StaffClock Team</span></p>

    <p><span style="color: #336699; font-weight: bold;">P.S.</span> We're excited to see what you'll accomplish! Don't forget to join our employee Slack channel at [link].</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully!');
  } catch (err) {
    console.error('Error sending welcome email:', err);
  }
}

module.exports = {
  sendWelcomeEmail
};