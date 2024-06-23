const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_MAILER_CLIENT_ID = '36928982945-76ujpd23bj9vnctmla2asi7q99sse5d4.apps.googleusercontent.com';
const GOOGLE_MAILER_CLIENT_SECRET = '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';
const GOOGLE_MAILER_REFRESH_TOKEN = '1//04IpvA15YtEuhCgYIARAAGAQSNwF-L9Ir4wtVfdxUEcL8X3oqu5Q6kZw2o1-p1QTaapmJHn8vJgtXEmCQoDBe7s5XgOv8ULTvgnU';
const ADMIN_EMAIL_ADDRESS = 'librarymanagementg5@gmail.com';

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);

myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
});

const getAccessToken = async () => {
  const myAccessTokenObject = await myOAuth2Client.getAccessToken();
  return myAccessTokenObject.token;
};

const createTransporter = async () => {
  const myAccessToken = await getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL_ADDRESS,
      clientId: GOOGLE_MAILER_CLIENT_ID,
      clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
      refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: myAccessToken
    }
  });
};

const sendEmail = async (req, res, next) => {
  const { user, password } = req.emailDetails;

  const transporter = await createTransporter();
  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: user.email,
    subject: 'Welcome to Our Service',
    text: `Hello ${user.name},\n\nYour account has been created. Here are your credentials:\n\nUsername: ${user.email}\nPassword: ${password}\n\nBest regards,\nYour Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
    res.status(201).json({ success: true, user });
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
    res.status(500).json({ success: false, message: 'Error sending email', error });
  }
};

module.exports = sendEmail;
