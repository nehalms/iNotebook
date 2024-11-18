const getForgotPasshtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html>
      <head>
          <title> Report </title>
      </head>
      <body>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          Hello, <br/><br/>
          Please use the following One-Time Password (OTP) to reset your account password: <br/>
        </p>
        <div style="font-family: Arial; font-weight: 500; color: #000; margin: 0px; background-color: #e0e0e0; text-align: center; padding: 1px; width: 200px">
          <p style="text-align: center; margin: 0px; font-size: 20pt;">${otp}</p>
        </div>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          This code is valid for the next 10 minutes and can only be used once.
        </p>
        <div 
          style="font-size: 12pt; font-family: Arial; font-weight: 500; color: #000; margin-top: 1.5rem;text-align: left">
          <br/>
          <p style="margin: 0px;">
            Best Regards,
            <br /><br />
            iNotebook team<br>
            Email : inotebook002@gmail.com<br>
          </p>
        </div>
      </body>
    </html>`
  return html;
}

const getSignUphtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html>
      <head>
          <title> Report </title>
      </head>
      <body>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          Hello , <br/><br/>
          Please use the following One-Time Password (OTP) to complete your account creation: <br/>
        </p>
        <div style="font-family: Arial; font-weight: 500; color: #000; margin: 0px; background-color: #e0e0e0; text-align: center; padding: 1px; width: 200px">
          <p style="text-align: center; margin: 0px; font-size: 20pt;">${otp}</p>
        </div>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          This code is valid for the next 10 minutes and is required to finalize your registration.
        </p>
        <div 
          style="font-size: 12pt; font-family: Arial; font-weight: 500; color: #000; margin-top: 1.5rem;text-align: left">
          <br/>
          <p style="margin: 0px;">
            Best Regards,
            <br /><br />
            iNotebook team<br>
            Email : inotebook002@gmail.com<br>
          </p>
        </div>
      </body>
    </html>`
  return html;
}

const getAdminNotifyhtml = (name, email) => {
  let html = `<!DOCTYPE html>
    <html>
      <head>
          <title> Report </title>
      </head>
      <body>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          Hello Admin, <br/><br/>
          A new user has just registered on the platform. Please review their account details and ensure everything is in order.  <br/>
        </p>
        <div style="font-family: Arial; font-weight: 500; color: #000; margin: 0px; background-color: #e0e0e0; text-align: center; padding: 1px; width: 500px">
          <p style="text-align: left; margin-left: 25px; font-size: 15pt;">Name: ${name}</p>
          <p style="text-align: left; margin-left: 25px; font-size: 15pt; text-decoration: none">Email: ${email}</p>
        </div>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          If any action is required on your part, please address it promptly. You can view the user's information in the admin dashboard.
        </p>
        <div 
          style="font-size: 12pt; font-family: Arial; font-weight: 500; color: #000; margin-top: 1.5rem;text-align: left">
          <br/>
          <p style="margin: 0px;">
            Best Regards,
            <br /><br />
            iNotebook team<br>
            Email : inotebook002@gmail.com<br>
          </p>
        </div>
      </body>
    </html>`
  return html;
}

const getAdminhtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html>
      <head>
          <title> Report </title>
      </head>
      <body>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          Hello Administrator, <br/><br/>
          Please use the following One-Time Password (OTP) to login to admin dashboard: <br/>
        </p>
        <div style="font-family: Arial; font-weight: 500; color: #000; margin: 0px; background-color: #e0e0e0; text-align: center; padding: 1px; width: 200px">
          <p style="text-align: center; margin: 0px; font-size: 20pt;">${otp}</p>
        </div>
        <p style="font-size: 12pt; font-weight: normal; font-family:Arial; color: #000;">
          This code is valid for the next 10 minutes and can only be used once.
        </p>
        <div 
          style="font-size: 12pt; font-family: Arial; font-weight: 500; color: #000; margin-top: 1.5rem;text-align: left">
          <br/>
          <p style="margin: 0px;">
            Best Regards,
            <br /><br />
            iNotebook team<br>
            Email : inotebook002@gmail.com<br>
          </p>
        </div>
      </body>
    </html>`
    return html;
}

module.exports = {
  getForgotPasshtml,
  getSignUphtml,
  getAdminNotifyhtml,
  getAdminhtml,
}