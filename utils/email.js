const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, link) => {
  // create reusable transporter object using the default SMTP transport
  console.log("Sending email...", email, subject, link);
  console.log(process.env.BASE_URL);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST || process.env.HOST_local,
      service: process.env.SERVICE || process.env.SERVICE_local,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER || process.env.USER_local,
        pass: process.env.PASS || process.env.PASS_local,
      },
    });

    await transporter.sendMail({
      from: process.env.USER || process.env.USER_local,
      to: email,
      subject: subject,
      html: `Hello,<br> Please Click on the link to verify your email.<br>
      <a href=${link}>Click here to verify</a><br><br>
      Please check mail in junk box if you not find in inbox.`,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;