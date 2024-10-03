var express = require('express');
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')
const port = process.env.PORT || 3000
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

var app = express();
app.use(cors());
app.use(bodyparser.json())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
console.log('process.env.EMAIL',process.env.EMAIL)
console.log('process.env.EMAIL_PASSWORD',process.env.EMAIL_PASSWORD)
app.post('/send-email', (req, res) => {
  const { name, email, subject , message } = req.body;

  // Set up the nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',  // Use any email service
    auth: {
      user: process.env.EMAIL,  // Your email
      pass: process.env.EMAIL_PASSWORD    // Your email password or App Password
    }
  });

  const emailTemplate = (username, email, subject, message) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #dddddd;
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        color: #333333;
      }
      .content {
        margin-bottom: 20px;
      }
      .content p {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>New Message from ${name}</h1>
      </div>
      <div class="content">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
      <div class="footer">
        <p>Thank you for reaching out to us!</p>
      </div>
    </div>
  </body>
  </html>
`;

  // Set up the email options
  const mailOptions = {
    from: email,
    to: 'mohit.devda056@gmail.com',
    subject: subject,
    html: emailTemplate(name, email, subject, message)
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    console.log('error',error)
    console.log('info',info)
    if (error) {
      return res.status(500).send('Failed to send email');
    }
    res.send('Email sent successfully');
  });
});

app.listen(port, () => {
    console.log("Server is running on port: ", port)
})


