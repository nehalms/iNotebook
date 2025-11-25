const getForgotPasshtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">iNotebook</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      We received a request to reset your account password. Please use the following One-Time Password (OTP) to complete the password reset process:
                    </p>
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    <!-- Important Notice -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        <strong>⚠️ Important:</strong> This code is valid for the next <strong>10 minutes</strong> and can only be used once. If you didn't request this password reset, please ignore this email or contact our support team.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      For security reasons, never share this code with anyone. Our team will never ask for your OTP.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong style="color: #333333;">The iNotebook Team</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      If you have any questions or concerns, please contact us at <a href="mailto:inotebook002@gmail.com" style="color: #667eea; text-decoration: none;">inotebook002@gmail.com</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #999999; font-size: 11px; line-height: 1.6;">
                      © ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getSignUphtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to iNotebook</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Thank you for signing up for iNotebook! To complete your account creation and ensure the security of your account, please use the following One-Time Password (OTP) to verify your email address:
                    </p>
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    <!-- Important Notice -->
                    <div style="background-color: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #0c5460; font-size: 14px; line-height: 1.6;">
                        <strong>ℹ️ Important:</strong> This verification code is valid for the next <strong>10 minutes</strong> and is required to finalize your registration. Once verified, you'll be able to access all features of iNotebook.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      If you didn't create an account with iNotebook, please ignore this email.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong style="color: #333333;">The iNotebook Team</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      If you have any questions or concerns, please contact us at <a href="mailto:inotebook002@gmail.com" style="color: #667eea; text-decoration: none;">inotebook002@gmail.com</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #999999; font-size: 11px; line-height: 1.6;">
                      © ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getAdminNotifyhtml = (name, email) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New User Registration - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">New User Registration</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Admin Notification</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello Administrator,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      A new user has just registered on the iNotebook platform. Please review their account details and ensure everything is in order.
                    </p>
                    <!-- User Details Box -->
                    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 10px 0; border-bottom: 1px solid #dee2e6;">
                            <strong style="color: #333333; font-size: 14px; display: inline-block; width: 100px;">Name:</strong>
                            <span style="color: #666666; font-size: 14px;">${name}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0;">
                            <strong style="color: #333333; font-size: 14px; display: inline-block; width: 100px;">Email:</strong>
                            <a href="mailto:${email}" style="color: #667eea; font-size: 14px; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!-- Action Notice -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        <strong>📋 Action Required:</strong> If any action is required on your part, please address it promptly. You can view the user's complete information and manage their account from the admin dashboard.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong style="color: #333333;">The iNotebook System</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      This is an automated notification from the iNotebook platform.
                    </p>
                    <p style="margin: 15px 0 0; color: #999999; font-size: 11px; line-height: 1.6;">
                      © ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getAdminhtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login Verification - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Admin Dashboard Access</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Login Verification Required</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello Administrator,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      For security purposes, please use the following One-Time Password (OTP) to complete your login to the admin dashboard:
                    </p>
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    <!-- Security Notice -->
                    <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.6;">
                        <strong>🔒 Security Notice:</strong> This code is valid for the next <strong>10 minutes</strong> and can only be used once. Never share this code with anyone. If you didn't request this login, please contact security immediately.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      This additional verification step helps protect your admin account from unauthorized access.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong style="color: #333333;">The iNotebook Security Team</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      If you have any security concerns, please contact us immediately at <a href="mailto:inotebook002@gmail.com" style="color: #dc3545; text-decoration: none;">inotebook002@gmail.com</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #999999; font-size: 11px; line-height: 1.6;">
                      © ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
    return html;
}

// Security Pin Enable Email Template
const getSecurityPinEnablehtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Enable Security Pin - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔒 Enable Security Pin</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Secure Your Account</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      You've requested to enable the Security Pin feature for your iNotebook account. This adds an extra layer of protection to your sensitive data. To proceed, please verify your email address using the One-Time Password (OTP) below:
                    </p>
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    <!-- Info Box -->
                    <div style="background-color: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0 0 10px; color: #0c5460; font-size: 14px; line-height: 1.6;">
                        <strong>ℹ️ What is Security Pin?</strong>
                      </p>
                      <p style="margin: 0; color: #0c5460; font-size: 14px; line-height: 1.6;">
                        Security Pin is a 6-digit code that protects your sensitive data (notes, tasks, images, etc.). Once enabled, you'll be asked to enter this pin whenever you access your account or view protected content.
                      </p>
                    </div>
                    <!-- Important Notice -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        <strong>⚠️ Important:</strong> This verification code is valid for the next <strong>10 minutes</strong>. After verification, you'll be prompted to set your 6-digit security pin. If you didn't request this, please ignore this email or contact support.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      For security reasons, never share this code with anyone. Our team will never ask for your OTP.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong style="color: #333333;">The iNotebook Security Team</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      If you have any questions or concerns, please contact us at <a href="mailto:inotebook002@gmail.com" style="color: #28a745; text-decoration: none;">inotebook002@gmail.com</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #999999; font-size: 11px; line-height: 1.6;">
                      © ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

// Security Pin Disable Email Template
const getSecurityPinDisablehtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Disable Security Pin - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔓 Disable Security Pin</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Security Verification Required</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello,
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      You've requested to disable the Security Pin feature for your iNotebook account. For security purposes, please verify your email address using the One-Time Password (OTP) below to complete this action:
                    </p>
                    <!-- OTP Box -->
                    <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #ffffff; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</p>
                    </div>
                    <!-- Warning Box -->
                    <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0 0 10px; color: #721c24; font-size: 14px; line-height: 1.6;">
                        <strong>⚠️ Important Security Notice:</strong>
                      </p>
                      <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.6;">
                        Disabling your Security Pin will remove the extra layer of protection from your account. Your sensitive data (notes, tasks, images, etc.) will no longer require pin verification to access. We recommend keeping this feature enabled for better security.
                      </p>
                    </div>
                    <!-- Info Box -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        <strong>⏱️ Time Limit:</strong> This verification code is valid for the next <strong>10 minutes</strong>. If you didn't request to disable your Security Pin, please ignore this email or contact support immediately.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      For security reasons, never share this code with anyone. Our team will never ask for your OTP.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong style="color: #333333;">The iNotebook Security Team</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6;">
                      If you have any security concerns or didn't request this change, please contact us immediately at <a href="mailto:inotebook002@gmail.com" style="color: #dc3545; text-decoration: none;">inotebook002@gmail.com</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #999999; font-size: 11px; line-height: 1.6;">
                      © ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getSecurityPinNotificationhtml = (userName) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Set Security Pin - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <!-- Header -->
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">iNotebook</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Set Your Security Pin</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello ${userName},
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      For enhanced security of your account, we recommend setting up a 6-digit security pin. This pin will be required when accessing sensitive data.
                    </p>
                    <!-- Steps -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <h3 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">How to Set Your Security Pin:</h3>
                      <ol style="margin: 0; padding-left: 20px; color: #666666; font-size: 16px; line-height: 1.8;">
                        <li>Log in to your iNotebook account</li>
                        <li>Go to your Profile page</li>
                        <li>Find the "Security Pin" section</li>
                        <li>Click on the toggle to enable security pin</li>
                        <li>Follow the on-screen instructions to set your 6-digit pin</li>
                      </ol>
                    </div>
                    <!-- Important Notice -->
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">
                        <strong>🔒 Security Tip:</strong> Choose a pin that is easy for you to remember but hard for others to guess. Never share your security pin with anyone.
                      </p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      If you have any questions or need assistance, please don't hesitate to contact our support team.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong>The iNotebook Team</strong>
                    </p>
                    <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 1.6; text-align: center;">
                      This is an automated email. Please do not reply to this message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getPermissionRequesthtml = (userName, userEmail, permission) => {
  const permissionNames = {
    notes: 'Notes',
    tasks: 'Tasks',
    images: 'Images',
    games: 'Games',
    messages: 'Messages',
    news: 'News',
    calendar: 'Calendar'
  };
  
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Permission Request - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">iNotebook</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">New Permission Request</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      A user has requested access to a feature:
                    </p>
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #333333; font-size: 16px;"><strong>User:</strong> ${userName}</p>
                      <p style="margin: 0 0 10px; color: #333333; font-size: 16px;"><strong>Email:</strong> ${userEmail}</p>
                      <p style="margin: 0; color: #333333; font-size: 16px;"><strong>Requested Feature:</strong> ${permissionNames[permission] || permission}</p>
                    </div>
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Please log in to the admin dashboard to review and respond to this request.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong>The iNotebook Team</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getPermissionResponsehtml = (userName, permission, approved, adminComment) => {
  const permissionNames = {
    notes: 'Notes',
    tasks: 'Tasks',
    images: 'Images',
    games: 'Games',
    messages: 'Messages',
    news: 'News',
    calendar: 'Calendar'
  };
  
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Permission Request Response - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4; padding: 20px 0;">
          <tr>
            <td align="center">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 0 auto;">
                <tr>
                  <td style="padding: 30px 30px 20px; text-align: center; background: linear-gradient(135deg, ${approved ? '#10b981' : '#ef4444'} 0%, ${approved ? '#059669' : '#dc2626'} 100%); border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">iNotebook</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px; font-weight: 600;">Permission Request ${approved ? 'Approved' : 'Declined'}</h2>
                    <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Hello ${userName},
                    </p>
                    <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                      Your request for access to <strong>${permissionNames[permission] || permission}</strong> has been <strong>${approved ? 'approved' : 'declined'}</strong>.
                    </p>
                    ${adminComment ? `
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <p style="margin: 0 0 10px; color: #333333; font-size: 14px; font-weight: 600;">Admin Comment:</p>
                      <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">${adminComment}</p>
                    </div>
                    ` : ''}
                    ${approved ? `
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      You can now access this feature. Please refresh your browser if needed.
                    </p>
                    ` : `
                    <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      If you have any questions, please contact the administrator.
                    </p>
                    `}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                      Best Regards,<br>
                      <strong>The iNotebook Team</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

module.exports = {
  getForgotPasshtml,
  getSignUphtml,
  getAdminNotifyhtml,
  getAdminhtml,
  getSecurityPinEnablehtml,
  getSecurityPinDisablehtml,
  getSecurityPinNotificationhtml,
  getPermissionRequesthtml,
  getPermissionResponsehtml,
}