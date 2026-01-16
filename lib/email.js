import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Check if email configuration is available
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn('Email configuration not found. Email sending will be disabled.');
    console.warn('Required: SMTP_HOST, SMTP_USER, SMTP_PASS');
    return null;
  }

  // Check if password is still placeholder
  if (smtpPass === 'your-app-password-here' || smtpPass.includes('your-')) {
    console.warn('Email configuration incomplete: SMTP_PASS appears to be a placeholder.');
    return null;
  }

  try {
    return nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false, // For self-signed certificates
      },
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Send contact form email notification
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Sender's name
 * @param {string} contactData.email - Sender's email
 * @param {string} contactData.subject - Email subject
 * @param {string} contactData.message - Email message
 * @returns {Promise<Object>} - Email sending result
 */
export async function sendContactEmail({ name, email, subject, message }) {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email transporter not available. Skipping email send.');
      return { success: false, error: 'Email configuration not available' };
    }

    // Escape user input to prevent XSS attacks
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Email content
    const mailOptions = {
      from: `"Vishal Car Wash" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'mr.vishalsingh1309@gmail.com',
      replyTo: email, // Use original email for reply-to (not escaped)
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                  Contact Information
                </h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555; width: 120px;">Name:</td>
                    <td style="padding: 10px 0; color: #333;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 10px 0; color: #333;">
                      <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #555;">Subject:</td>
                    <td style="padding: 10px 0; color: #333;">${safeSubject}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                  Message
                </h2>
                <p style="color: #333; white-space: pre-wrap; line-height: 1.8;">${safeMessage}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                  This email was sent from the Vishal Car Wash contact form.<br>
                  You can reply directly to this email to respond to ${safeName}.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Contact Information:
- Name: ${name}
- Email: ${email}
- Subject: ${subject}

Message:
${message}

---
This email was sent from the Vishal Car Wash contact form.
You can reply directly to this email to respond to ${name}.
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Contact email sent successfully:', info.messageId);
    console.log('📧 Email sent to:', process.env.CONTACT_EMAIL || 'mr.vishalsingh1309@gmail.com');
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending contact email:', error.message);
    
    // Provide more helpful error messages
    let errorMessage = error.message;
    if (error.code === 'EAUTH') {
      errorMessage = 'Authentication failed. Please check your SMTP credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection failed. Please check your SMTP host and port.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout. Please check your network connection.';
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Verify email configuration
 * @returns {Promise<boolean>} - True if email is configured
 */
export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return false;
    }
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Email configuration verification failed:', error);
    return false;
  }
}

