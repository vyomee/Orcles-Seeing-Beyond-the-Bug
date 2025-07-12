// Email service configuration
const EMAIL_CONFIG = {
  senderEmail: 'oraclesseeingbeyondthebug@gmail.com',
  senderPassword: 'AKRV@0227',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587
};

export interface EmailVerificationData {
  email: string;
  verificationToken: string;
  baseUrl: string;
}

export const sendVerificationEmail = async (data: EmailVerificationData): Promise<boolean> => {
  try {
    // In a real application, you would use a service like SendGrid, Mailgun, or AWS SES
    // For this demo, we'll simulate the email sending process
    
    const verificationLink = `${data.baseUrl}/verify-email?token=${data.verificationToken}&email=${encodeURIComponent(data.email)}`;
    
    const emailContent = {
      to: data.email,
      from: EMAIL_CONFIG.senderEmail,
      subject: 'Verify Your Email Address',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome!</h1>
              <p>Please verify your email address to complete your registration</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>Thank you for signing up. To complete your account setup, please click the button below to verify your email address:</p>
              
              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Complete Account Setup</a>
              </div>
              
              <p>This link will take you to a page where you can complete your profile by providing your username, password, location, and profile picture.</p>
              
              <p>If you didn't create an account, you can safely ignore this email.</p>
              
              <p><strong>Note:</strong> This verification link will expire in 24 hours for security reasons.</p>
            </div>
            <div class="footer">
              <p>This email was sent from ${EMAIL_CONFIG.senderEmail}</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Log the email content for development purposes
    console.log('📧 Email Verification Sent');
    console.log('To:', emailContent.to);
    console.log('From:', emailContent.from);
    console.log('Subject:', emailContent.subject);
    console.log('Verification Link:', verificationLink);
    console.log('Email Content:', emailContent.html);

    // In production, you would actually send the email here using your preferred email service
    // Example with SendGrid:
    // await sgMail.send(emailContent);
    
    // For demo purposes, we'll simulate a successful send
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

export const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
