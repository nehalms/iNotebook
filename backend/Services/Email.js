const nodemailer = require('nodemailer');

function Email(
        email = [], 
        ccs = [],
        subject = '', 
        text, 
        html,
        toAdmin,
    ) {
    return new Promise(async (resolve, reject) => {
      let emails = Array.isArray(email)
        ? [...new Set(email)]
        : email

      let cc = Array.isArray(ccs)
        ? [...new Set(ccs)]
        : ccs

      var transporter = nodemailer.createTransport({
        secureConnection: false,
        port: 587, 
        service: 'gmail',
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_PASSWORD,
        },
        tls: {
          ciphers: 'SSLv3',
        },
      });
      
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
      console.log(mailOptions);
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info.response);
        }
      });
    });
}

module.exports = {
  Email,
}
