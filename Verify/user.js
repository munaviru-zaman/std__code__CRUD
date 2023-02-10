const { response } = require("express");

const accountSid = "ACa63eb523a0889c9757b1f41b683795a1";
const authToken = "fd86c32b06a2e6d6744ed4ced89b60d5";
const verifySid = "VAf29c9c6e1cdbf15ce2b78b1bd91fae77";
const client = require("twilio")(accountSid, authToken);
// const mobile__otp = (req, res) => {
//   client.verify.v2
//     .services(verifySid)
//     .verifications.create({ to: `+91${req.body.number}`, channel: "sms" })
//     .then((response) => {
//       if (response) {
//         console.log("RESPONSE", response);
//         res.status(203).send("response");
//       } else {
//         res.status(403).send({ message: "Invalid Mobile Number" });
//       }
//     });
// };

const mobile__otp = async (req, res) => {
  try {
    const verify_mobile = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: `+91${req.body.number}`, channel: "sms" });
    if (verify_mobile) {
      console.log("RESPONSE", response);
      res.status(203).send("response");
    } else {
      res.status(403).send({ message: "Invalid Mobile Number" });
    }
  } catch (error) {
    res.status(400).send("munna");
  }
};

// ____________________________________________________________________________________________
// ____________________________________________________________________________________________
// ___________________________________Email__verification______________________________________
// ____________________________________________________________________________________________

// const nodemailer = require("nodemailer");

// const verifyEmailAddress = async (req, res) => {
//   let testAccount = await nodemailer.createTestAccount();

//   // Create a transporter object using SMTP

//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   // Send the verification email

//   let info = await transporter.sendMail({
//     from: '"Verification" <verification@example.com>',
//     to: req.body.email,
//     subject: "Verify your email address",
//     text: "Please respond to this email to verify your email address",
//     html: "<p>Please respond to this email to verify your email address</p>",
//   });

//   console.log("Message sent: %s", info.messageId);
// };

// verifyEmailAddress("munaviruzaman@gmail.com").catch(console.error);

module.exports = { mobile__otp };
