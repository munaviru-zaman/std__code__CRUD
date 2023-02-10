require("dotenv").config();

const nodemailer = require("nodemailer");
const mailgen = require("mailgen");

const mail__verify = (name, intro, instructions, btn_text, link, to) => {
  let config = {
    service: "gmail",
    auth: {
      pass: process.env.PASSWORD,
      user: process.env.EMAIL,
    },
  };

  let transporter = nodemailer.createTransport(config);

  const mailGenerator = new mailgen({
    theme: "cerberus",
    product: {
      name: "Akatsuki",
      link: "http://mailgen.js/",
    },
  });

  const mailBody = {
    body: {
      name: name,
      intro: intro,
      action: {
        instructions: instructions,
        button: {
          color: "#000",
          text: btn_text,
          link: link,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
      signature: "Thank You",
      greetings: true,
    },
  };

  const email = mailGenerator.generate(mailBody);

  let message = {
    from: process.env.EMAIL,
    to: to,
    subject: btn_text,
    html: email,
  };

  transporter.sendMail(message, function (error, info) {
    if (error) {
      console.error(error);
    } else {
      console.log("Email send", info.response);
    }
  });
};

module.exports = { mail__verify };
