const nodemailer = require('nodemailer');
const brevo = require('@getbrevo/brevo');

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

// Send email using Brevo
async function sendViaBrevo(emails, ccs, subject, text, html, toAdmin) {
  const apiInstance = new brevo.TransactionalEmailsApi();
  
  // Set API Key
  const apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  
  // Set content (prefer HTML over text)
  if (html != null && html != '') {
    sendSmtpEmail.htmlContent = html;
  } else if (text) {
    sendSmtpEmail.textContent = text;
  }
  
  // SENDER: Use ADMIN_EMAIL from env
  sendSmtpEmail.sender = { 
    name: "iNotebook", 
    email: process.env.ADMIN_EMAIL
  };
  
  // RECIPIENT: Handle single email or array, and toAdmin flag
  if (toAdmin) {
    sendSmtpEmail.to = [{ email: process.env.ADMIN_EMAIL }];
  } else {
    const emailArray = Array.isArray(emails) ? emails : [emails];
    sendSmtpEmail.to = emailArray.map(email => ({ email }));
  }
  
  // Handle CC if provided
  if (ccs && ccs.length > 0) {
    const ccArray = Array.isArray(ccs) ? ccs : [ccs];
    sendSmtpEmail.cc = ccArray.map(email => ({ email }));
  }
  
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully via Brevo API:", data.response.statusCode, data.response.statusMessage);
    return data;
  } catch (error) {
    console.error("Brevo API Error:", error);
    throw error;
  }
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
          : email

        let cc = Array.isArray(ccs)
          ? [...new Set(ccs)]
          : ccs

        const useBrevo = process.env.USE_BREVO === 'true' || process.env.USE_BREVO === '1';
        
        if (useBrevo) {
          try {
            const data = await sendViaBrevo(emails, cc, subject, text, html, toAdmin);
            resolve(data);
          } catch (brevoError) {
            console.log('Brevo email send error, falling back to Google:', brevoError);
            reject(brevoError);
          }
        } else {
          try {
            const result = await sendViaGoogle(emails, cc, subject, text, html, toAdmin);
            resolve(result);
          } catch (googleError) {
            console.log('Google email send error, falling back to Brevo:', googleError);
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
