const nodemailer = require('nodemailer');

// Create a reusable transporter (singleton pattern)
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
          : email

        let cc = Array.isArray(ccs)
          ? [...new Set(ccs)]
          : ccs

        const mailTransporter = getTransporter();
        
        var mailOptions = {
          from: process.env.ADMIN_EMAIL,
          to: toAdmin ? process.env.ADMIN_EMAIL : emails,
          subject: subject,
        };
        
        if (cc && cc.length > 0) {
          mailOptions.cc = cc;
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

module.exports = {
  Email,
}
