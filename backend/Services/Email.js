const nodemailer = require('nodemailer');
const axios = require('axios');

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// Create a reusable transporter (singleton pattern) for Google SMTP
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
      connectionTimeout: 20000,
    });

    transporter.verify((error, success) => {
      if (error) console.log("Email transporter verification error:", error);
      else console.log("Email transporter is ready to send messages");
    });
  }
  return transporter;
}

// Send email using Google SMTP (nodemailer)
function sendViaGoogle(emails, ccs, subject, text, html, toAdmin) {
  return new Promise((resolve, reject) => {
    try {
      const mailTransporter = getTransporter();
      
      var mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: toAdmin ? process.env.ADMIN_EMAIL : emails,
        subject: subject,
      };
      
      if (ccs && ccs.length > 0) {
        mailOptions.cc = ccs;
      }

      if (html == null || html == '') {
        mailOptions.text = text;
      } else {
        mailOptions.html = html;
      }
      
      mailTransporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('Email send error:', error);
          reject(error);
        } else {
          console.log(`Email sent: ` + info.response);
          resolve(info.response);
        }
      });
    } catch (error) {
      console.log('Email function error:', error);
      reject(error);
    }
  });
}

function Email(
        email = [], 
        ccs = [],
        subject = '', 
        text, 
        html,
        toAdmin = false,
    ) {
  return new Promise(async (resolve, reject) => {
    try {
      let emails = Array.isArray(email)
        ? [...new Set(email)]
        : email;

      let cc = Array.isArray(ccs)
        ? [...new Set(ccs)]
        : ccs;

      const useScript = process.env.USE_SCRIPT === 'true' || process.env.USE_SCRIPT === '1';

      if (useScript && GOOGLE_SCRIPT_URL) {
        try {
          const toAddress = toAdmin
            ? process.env.ADMIN_EMAIL
            : (Array.isArray(emails) ? emails.join(',') : emails);

          const htmlContent = (html != null && html !== '')
            ? html
            : (text ? `<pre>${text}</pre>` : '');

          const response = await axios.post(GOOGLE_SCRIPT_URL, {
            to: toAddress,
            subject: subject,
            htmlBody: htmlContent,
          });

          if (response.data && response.data.status === 'success') {
            console.log("Email sent successfully via Google Script!");
            resolve(response.data);
          } else {
            const message = response.data && response.data.message
              ? response.data.message
              : 'Unknown error from Google Script';
            console.error("Google Script Error:", message);
            reject(new Error(message));
          }
        } catch (error) {
          console.error("Network Error while calling Google Script:", error.message || error);
          reject(error);
        }
      } else {
        try {
          const result = await sendViaGoogle(emails, cc, subject, text, html, toAdmin);
          resolve(result);
        } catch (googleError) {
          console.log('Google email send error:', googleError);
          reject(googleError);
        }
      }
    } catch (error) {
      console.log('Email function error:', error);
      reject(error);
    }
  });
}

module.exports = {
  Email,
}
