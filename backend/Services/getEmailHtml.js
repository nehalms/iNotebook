const APP_URL = process.env.APP_URL || 'https://inotebook-net.vercel.app/';
const BRAND_COLOR = '#4f46e5';

const getForgotPasshtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
      </head>
  <body style="margin: 0; padding: 0; background-color: #F4F6F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F4F6F8;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #0077C5;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <div style="display: inline-block; padding: 12px; background-color: #E0F2FE; border-radius: 50%; margin-bottom: 20px;">
                  <span style="font-size: 24px;">🔑</span>
                </div>
                <h1 style="margin: 0; color: #1F2937; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Reset Password</h1>
                <p style="margin: 12px 0 0; color: #6B7280; font-size: 16px; line-height: 1.5;">
                  Hello, we received a request to reset your <strong>iNotebook</strong> account password.
                </p>
              </td>
            </tr>
            <!-- OTP Box -->
            <tr>
              <td style="padding: 0 40px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 30px; background-color: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 8px;">
                      <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280; margin-bottom: 12px; font-weight: 600;">Use this code to reset password</span>
                      <span style="font-family: 'SF Mono', 'Menlo', Consolas, monospace; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 8px;">
                        ${otp}
                      </span>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
            <!-- Info -->
            <tr>
              <td style="padding: 30px 40px;">
                <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; padding: 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #9A3412; line-height: 1.5;">
                    <strong>⚠️ Important:</strong> This code expires in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.
                      </p>
                    </div>
                <p style="margin: 30px 0 0; color: #6B7280; font-size: 14px; line-height: 1.5; text-align: center;">
                  For security reasons, never share this code with anyone.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 10px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:inotebook002@gmail.com" style="color: #0077C5; text-decoration: none; font-weight: 600;">inotebook002@gmail.com</a>
                </p>
                <p style="margin: 0 0 6px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Or open the app: <a href="${APP_URL}" style="color: #0077C5; text-decoration: none; font-weight: 600;">iNotebook</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
            </td>
          </tr>
        </table>
      </body>
  </html>`;
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
  <body style="margin: 0; padding: 0; background-color: #F3F4FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F3F4FF;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #4F46E5;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <div style="display: inline-block; padding: 12px; background-color: #E0E7FF; border-radius: 50%; margin-bottom: 20px;">
                  <span style="font-size: 24px;">✉️</span>
                </div>
                <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Verify your email</h1>
                <p style="margin: 12px 0 0; color: #6B7280; font-size: 16px; line-height: 1.5;">
                  Thanks for signing up to <strong>iNotebook</strong>. Enter this code to finish creating your account.
                </p>
              </td>
            </tr>
            <!-- OTP Box -->
            <tr>
              <td style="padding: 0 40px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 30px; background-color: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 8px;">
                      <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280; margin-bottom: 12px; font-weight: 600;">Your verification code</span>
                      <span style="font-family: 'SF Mono', 'Menlo', Consolas, monospace; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 8px;">
                        ${otp}
                      </span>
                      <span style="display:block;margin-top:10px;font-size:12px;color:#6B7280;">Valid for 10 minutes</span>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
            <!-- Info -->
            <tr>
              <td style="padding: 30px 40px;">
                <div style="background-color: #EEF2FF; border-left: 4px solid #4F46E5; padding: 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #312E81; line-height: 1.5;">
                    If you didn't create an iNotebook account, you can safely ignore this email and your address won't be used.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 10px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Need help? Contact us at <a href="mailto:inotebook002@gmail.com" style="color: #4F46E5; text-decoration: none; font-weight: 600;">inotebook002@gmail.com</a>
                </p>
                <p style="margin: 0 0 6px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Open the app: <a href="${APP_URL}" style="color: #4F46E5; text-decoration: none; font-weight: 600;">iNotebook</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
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
  <body style="margin: 0; padding: 0; background-color: #F4F5FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F4F5FB;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #7C3AED;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 32px 40px 12px 40px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #6B21A8; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                  Admin notification
                </p>
                <h1 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                  New user joined iNotebook
                </h1>
                <p style="margin: 10px 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  A new user has just created an account. Here are their details:
                </p>
                  </td>
                </tr>
            <!-- User Details -->
            <tr>
              <td style="padding: 0 40px 24px 40px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                    <td style="padding: 18px 18px; background-color: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
                      <p style="margin: 0 0 8px; font-size: 14px; color: #374151;">
                        <strong style="display:inline-block;width:70px;color:#4B5563;">Name</strong>
                        <span>${name}</span>
                      </p>
                      <p style="margin: 8px 0 0; font-size: 14px; color: #374151; border-top: 1px solid #E5E7EB; padding-top: 8px;">
                        <strong style="display:inline-block;width:70px;color:#4B5563;">Email</strong>
                        <a href="mailto:${email}" style="color: #7C3AED; text-decoration: none; font-weight: 500;">${email}</a>
                      </p>
                          </td>
                        </tr>
                      </table>
              </td>
            </tr>
            <!-- Info -->
            <tr>
              <td style="padding: 0 40px 28px 40px;">
                <div style="background-color: #F5F3FF; border-left: 4px solid #7C3AED; padding: 14px 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #4C1D95; line-height: 1.6;">
                    Review this account in the admin area if you need to adjust permissions, security settings, or usage limits.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Open the dashboard: <a href="${APP_URL}" style="color: #7C3AED; text-decoration: none; font-weight: 600;">iNotebook admin</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} iNotebook. Automated admin notification.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
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
  <body style="margin: 0; padding: 0; background-color: #FEF2F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FEF2F2;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #DC2626;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 32px 40px 16px 40px;">
                <p style="margin: 0 0 4px; font-size: 12px; color: #B91C1C; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                  Security verification
                </p>
                <h1 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                  Confirm admin login
                </h1>
                <p style="margin: 10px 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  Use this one-time code to finish signing in to the iNotebook admin dashboard.
                </p>
              </td>
            </tr>
            <!-- OTP -->
            <tr>
              <td style="padding: 0 40px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 26px 24px; background-color: #FEF2F2; border-radius: 8px; border: 1px solid #FCA5A5;">
                      <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #B91C1C; margin-bottom: 10px; font-weight: 600;">Admin verification code</span>
                      <span style="font-family: 'SF Mono', 'Menlo', Consolas, monospace; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 8px;">
                        ${otp}
                      </span>
                      <span style="display:block;margin-top:10px;font-size:12px;color:#991B1B;">Expires in 10 minutes • For this login only</span>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
            <!-- Warning -->
            <tr>
              <td style="padding: 28px 40px 24px 40px;">
                <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #7F1D1D; line-height: 1.6;">
                    <strong>🔒 Keep this code private.</strong> Never share it in chat, email, or screenshots. If you didn't start this login, change your password and review recent activity immediately.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Open admin: <a href="${APP_URL}" style="color: #DC2626; text-decoration: none; font-weight: 600;">iNotebook admin</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} iNotebook. Security notification.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
            </td>
          </tr>
        </table>
      </body>
    </html>`
    return html;
}

const getSecurityPinEnablehtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Enable Security Pin - iNotebook</title>
      </head>
  <body style="margin: 0; padding: 0; background-color: #ECFDF3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ECFDF3;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #16A34A;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 36px 40px 18px 40px; text-align: center;">
                <div style="display: inline-block; padding: 12px; background-color: #DCFCE7; border-radius: 50%; margin-bottom: 18px;">
                  <span style="font-size: 24px;">🔒</span>
                </div>
                <h1 style="margin: 0; color: #14532D; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">Enable Security Pin</h1>
                <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                  Add an extra layer of protection to your <strong>iNotebook</strong> account with a Security Pin.
                </p>
              </td>
            </tr>
            <!-- OTP Box -->
            <tr>
              <td style="padding: 0 40px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 26px 24px; background-color: #F9FAFB; border-radius: 8px; border: 1px dashed #D1D5DB;">
                      <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #6B7280; margin-bottom: 10px; font-weight: 600;">Verification code</span>
                      <span style="font-family: 'SF Mono', 'Menlo', Consolas, monospace; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 8px;">
                        ${otp}
                      </span>
                      <span style="display:block;margin-top:10px;font-size:12px;color:#6B7280;">Valid for 10 minutes</span>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
            <!-- Info -->
            <tr>
              <td style="padding: 26px 40px 22px 40px;">
                <div style="background-color: #ECFDF3; border-left: 4px solid #16A34A; padding: 14px 16px; border-radius: 4px; margin-bottom: 16px;">
                  <p style="margin: 0; font-size: 13px; color: #14532D; line-height: 1.6;">
                    <strong>What is a Security Pin?</strong> It's a 6‑digit code that helps protect notes, tasks, images and other sensitive content in your account.
                      </p>
                    </div>
                <div style="background-color: #FEFCE8; border-left: 4px solid #EAB308; padding: 14px 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #713F12; line-height: 1.6;">
                    <strong>Important:</strong> After confirming this code, you’ll be prompted in the app to set your 6‑digit Security Pin. Don’t share this code or your pin with anyone.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Questions? Contact us at <a href="mailto:inotebook002@gmail.com" style="color: #16A34A; text-decoration: none; font-weight: 600;">inotebook002@gmail.com</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getSecurityPinDisablehtml = (otp) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Disable Security Pin - iNotebook</title>
      </head>
  <body style="margin: 0; padding: 0; background-color: #FEF2F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FEF2F2;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #DC2626;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 36px 40px 18px 40px; text-align: center;">
                <div style="display: inline-block; padding: 12px; background-color: #FEE2E2; border-radius: 50%; margin-bottom: 18px;">
                  <span style="font-size: 24px;">🔓</span>
                </div>
                <h1 style="margin: 0; color: #991B1B; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">Disable Security Pin</h1>
                <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                  You requested to remove the Security Pin from your <strong>iNotebook</strong> account.
                </p>
              </td>
            </tr>
            <!-- OTP Box -->
            <tr>
              <td style="padding: 0 40px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="padding: 26px 24px; background-color: #FEF2F2; border-radius: 8px; border: 1px dashed #FCA5A5;">
                      <span style="display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #B91C1C; margin-bottom: 10px; font-weight: 600;">Verification code</span>
                      <span style="font-family: 'SF Mono', 'Menlo', Consolas, monospace; font-size: 32px; font-weight: 700; color: #111827; letter-spacing: 8px;">
                        ${otp}
                      </span>
                      <span style="display:block;margin-top:10px;font-size:12px;color:#991B1B;">Valid for 10 minutes</span>
                    </td>
                  </tr>
                </table>
                  </td>
                </tr>
            <!-- Info -->
            <tr>
              <td style="padding: 26px 40px 22px 40px;">
                <div style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 14px 16px; border-radius: 4px; margin-bottom: 14px;">
                  <p style="margin: 0; font-size: 13px; color: #7F1D1D; line-height: 1.6;">
                    <strong>Important:</strong> Disabling your Security Pin removes an extra layer of protection. Sensitive content will no longer require the pin.
                      </p>
                    </div>
                <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 14px 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.6;">
                    If you didn’t request this change, do not use this code and contact support immediately.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Security help: <a href="mailto:inotebook002@gmail.com" style="color: #DC2626; text-decoration: none; font-weight: 600;">inotebook002@gmail.com</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                  &copy; ${new Date().getFullYear()} iNotebook. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
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
  <body style="margin: 0; padding: 0; background-color: #EFF6FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #EFF6FF;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
            <!-- Top Accent -->
            <tr>
              <td style="height: 6px; background-color: #2563EB;"></td>
            </tr>
                <!-- Header -->
                <tr>
              <td style="padding: 32px 40px 16px 40px;">
                <h1 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; text-align:center;">
                  Set up your Security Pin
                </h1>
                <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6; text-align:center;">
                  Hello ${userName}, keep your workspace safer by adding a Security Pin.
                </p>
                  </td>
                </tr>
            <!-- Steps -->
            <tr>
              <td style="padding: 0 40px 24px 40px;">
                <div style="background-color: #F9FAFB; border-radius: 8px; padding: 20px 20px 18px 20px; border: 1px solid #E5E7EB;">
                  <h3 style="margin: 0 0 12px; color: #111827; font-size: 16px; font-weight: 600;">How to set your 6‑digit pin</h3>
                  <ol style="margin: 0; padding-left: 20px; color: #4B5563; font-size: 14px; line-height: 1.8;">
                    <li>Open the <strong>iNotebook</strong> app.</li>
                    <li>Go to your <strong>Profile</strong> page.</li>
                    <li>Find the <strong>Security Pin</strong> section.</li>
                    <li>Switch the toggle on to enable the pin.</li>
                    <li>Follow the prompts to choose your 6‑digit pin.</li>
                      </ol>
                    </div>
              </td>
            </tr>
            <!-- Info -->
            <tr>
              <td style="padding: 0 40px 26px 40px;">
                <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 14px 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 13px; color: #92400E; line-height: 1.6;">
                    <strong>Tip:</strong> Choose a pin that’s easy for you to remember but hard for others to guess. Never share your Security Pin with anyone.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
              <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                  Need help? Reach us at <a href="mailto:inotebook002@gmail.com" style="color: #2563EB; text-decoration: none; font-weight: 600;">inotebook002@gmail.com</a>
                </p>
                <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                  This is an automated email. Please don’t reply directly.
                    </p>
                  </td>
                </tr>
              </table>
          <div style="height: 40px;"></div>
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
      <body style="margin: 0; padding: 0; background-color: #EEF2FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #EEF2FF;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                <!-- Top Accent -->
                <tr>
                  <td style="height: 6px; background-color: #4F46E5;"></td>
                </tr>
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px 14px 40px;">
                    <p style="margin: 0 0 4px; font-size: 12px; color: #4338CA; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                      Permission request
                    </p>
                    <h1 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                      A user requested access
                    </h1>
                    <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                      Review the details below and decide whether to approve this request in the admin area.
                    </p>
                  </td>
                </tr>
                <!-- Details -->
                <tr>
                  <td style="padding: 0 40px 24px 40px;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 18px 18px; background-color: #F9FAFB; border-radius: 8px; border: 1px solid #E5E7EB;">
                          <p style="margin: 0 0 8px; font-size: 14px; color: #374151;">
                            <strong style="display:inline-block;width:90px;color:#4B5563;">User</strong>
                            <span>${userName}</span>
                          </p>
                          <p style="margin: 8px 0 8px; font-size: 14px; color: #374151; border-top: 1px solid #E5E7EB; padding-top: 8px;">
                            <strong style="display:inline-block;width:90px;color:#4B5563;">Email</strong>
                            <a href="mailto:${userEmail}" style="color: #4F46E5; text-decoration: none; font-weight: 500;">${userEmail}</a>
                          </p>
                          <p style="margin: 0; font-size: 14px; color: #374151; border-top: 1px solid #E5E7EB; padding-top: 8px;">
                            <strong style="display:inline-block;width:90px;color:#4B5563;">Feature</strong>
                            <span>${permissionNames[permission] || permission}</span>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Info -->
                <tr>
                  <td style="padding: 0 40px 26px 40px;">
                    <div style="background-color: #EEF2FF; border-left: 4px solid #4F46E5; padding: 14px 16px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 13px; color: #312E81; line-height: 1.6;">
                        Go to the admin dashboard to approve or decline this request. Changes will apply immediately for the user.
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      Open admin: <a href="${APP_URL}" style="color: #4F46E5; text-decoration: none; font-weight: 600;">iNotebook admin</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                      &copy; ${new Date().getFullYear()} iNotebook. Automated permission notification.
                    </p>
                  </td>
                </tr>
              </table>
              <div style="height: 40px;"></div>
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
  
  const bgColor = approved ? '#ECFDF3' : '#FEF2F2';
  const accentColor = approved ? '#16A34A' : '#DC2626';
  const textAccent = approved ? '#166534' : '#991B1B';
  const badgeBg = approved ? '#DCFCE7' : '#FEE2E2';
  const badgeText = approved ? '#14532D' : '#7F1D1D';
  const statusLabel = approved ? 'Approved' : 'Declined';

  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Permission Request Response - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: ${bgColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: ${bgColor};">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                <!-- Top Accent -->
                <tr>
                  <td style="height: 6px; background-color: ${accentColor};"></td>
                </tr>
                <!-- Header -->
                <tr>
                  <td style="padding: 28px 40px 10px 40px;">
                    <div style="text-align:left;">
                      <span style="display:inline-block;padding:4px 10px;border-radius:999px;background-color:${badgeBg};color:${badgeText};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px;">
                        ${statusLabel}
                      </span>
                    </div>
                    <h1 style="margin: 0; color: ${textAccent}; font-size: 20px; font-weight: 700; letter-spacing: -0.3px;">
                      Permission for ${permissionNames[permission] || permission}
                    </h1>
                    <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                      Hello ${userName}, your request to use <strong>${permissionNames[permission] || permission}</strong> has been <strong>${statusLabel.toLowerCase()}</strong>.
                    </p>
                  </td>
                </tr>
                <!-- Admin note and next steps -->
                <tr>
                  <td style="padding: 0 40px 24px 40px;">
                    ${adminComment ? `
                    <div style="background-color: #F9FAFB; border-radius: 8px; padding: 14px 16px; border: 1px solid #E5E7EB; margin-bottom: 16px;">
                      <p style="margin: 0 0 6px; font-size: 13px; color: #4B5563; font-weight: 600;">Message from admin</p>
                      <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">${adminComment}</p>
                    </div>
                    ` : ''}
                    <div style="background-color: ${badgeBg}; border-left: 4px solid ${accentColor}; padding: 14px 16px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 13px; color: ${badgeText}; line-height: 1.6;">
                        ${approved
                          ? 'You can start using this feature in your iNotebook workspace. If you don’t see it immediately, try refreshing the page or signing in again.'
                          : 'You won’t be able to use this feature right now. If you need access or more context about this decision, contact the administrator.'}
                      </p>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      Open your workspace: <a href="${APP_URL}" style="color: ${accentColor}; text-decoration: none; font-weight: 600;">iNotebook</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                      &copy; ${new Date().getFullYear()} iNotebook. Permission update.
                    </p>
                  </td>
                </tr>
              </table>
              <div style="height: 40px;"></div>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getAccountActivatedhtml = (userName) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Reactivated - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ECFDF3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ECFDF3;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                <!-- Top Accent -->
                <tr>
                  <td style="height: 6px; background-color: #16A34A;"></td>
                </tr>
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px 16px 40px; text-align:center;">
                    <h1 style="margin: 0; color: #166534; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                      Your account is active again
                    </h1>
                    <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                      Hello ${userName}, your <strong>iNotebook</strong> account has been reactivated and is ready to use.
                    </p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 0 40px 26px 40px;">
                    <div style="background-color: #DCFCE7; border-left: 4px solid #16A34A; padding: 14px 16px; border-radius: 4px; margin-bottom: 18px;">
                      <p style="margin: 0; color: #166534; font-size: 13px; line-height: 1.6;">
                        <strong>Account status:</strong> Active. Your notes, tasks, and other data are available again.
                      </p>
                    </div>
                    <p style="margin: 0 0 8px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                      You can sign in as usual and continue where you left off.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      Open your workspace: <a href="${APP_URL}" style="color: #16A34A; text-decoration: none; font-weight: 600;">iNotebook</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                      &copy; ${new Date().getFullYear()} iNotebook. Account status update.
                    </p>
                  </td>
                </tr>
              </table>
              <div style="height: 40px;"></div>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  return html;
}

const getAccountDeactivatedhtml = (userName) => {
  let html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Deactivated - iNotebook</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FEF3C7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #FEF3C7;">
          <tr>
            <td align="center" style="padding: 40px 0;">
              <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
                <!-- Top Accent -->
                <tr>
                  <td style="height: 6px; background-color: #F59E0B;"></td>
                </tr>
                <!-- Header -->
                <tr>
                  <td style="padding: 32px 40px 16px 40px; text-align:center;">
                    <h1 style="margin: 0; color: #92400E; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                      Your account is currently inactive
                    </h1>
                    <p style="margin: 10px 0 0; color: #4B5563; font-size: 14px; line-height: 1.6;">
                      Hello ${userName}, your <strong>iNotebook</strong> account has been deactivated by an administrator.
                    </p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 0 40px 26px 40px;">
                    <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 14px 16px; border-radius: 4px; margin-bottom: 18px;">
                      <p style="margin: 0; color: #92400E; font-size: 13px; line-height: 1.6;">
                        <strong>Account status:</strong> Inactive. You won’t be able to sign in until an admin reactivates your account. Your data is preserved and will be available again after reactivation.
                      </p>
                    </div>
                    <p style="margin: 0 0 8px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                      If you think this was a mistake or you need access restored, please contact support.
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #9CA3AF; line-height: 1.5;">
                      Contact support: <a href="mailto:inotebook002@gmail.com" style="color: #F59E0B; text-decoration: none; font-weight: 600;">inotebook002@gmail.com</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #9CA3AF; line-height: 1.5;">
                      &copy; ${new Date().getFullYear()} iNotebook. Account status update.
                    </p>
                  </td>
                </tr>
              </table>
              <div style="height: 40px;"></div>
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
  getAccountActivatedhtml,
  getAccountDeactivatedhtml,
}