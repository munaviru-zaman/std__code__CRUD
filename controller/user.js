const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const random_string = require("randomstring");
const email__verify = require("../Verify/email_verify");
// const pswdHash = require("password-hash");

// const securepassword = (password) => {
//   const passwordHash = bcrypt.hash(password, 10);
//   console.log(passwordHash);
// };

// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _________________________________password_hashing______________________________________
// _______________________________________________________________________________________

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _______________________________________________________________________________________
// ___________________________________token_creation______________________________________
// _______________________________________________________________________________________

const create__token = async (id) => {
  try {
    const token = await jwt.sign({ id }, "naruto__secret__ninja__book");
    return token;
  } catch (error) {
    res.status(400).send(err.message);
  }
};

// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _______________________________________________________________________________________
// ___________________________________signup_______________________________________________
// _______________________________________________________________________________________

const signup = async (req, res) => {
  const { shinobi_name, shinobi_clan, email, password } = req.body;
  const token = random_string.generate();
  console.log(token);
  const spassword = await hashPassword(password);
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(400).send({ message: "Shinobi already exists..." });
    } else {
      const newUser = userModel({
        shinobi_name,
        shinobi_clan,
        email,
        password: spassword,
        token,
      });
      await newUser.save();
      const intro =
        "Welcome to Akatsuki, We're very excited to have you on board.";
      const instructions = "To confirm your email, Please click here:";
      const btn_text = "Confirm Your Email";
      const link = `http://localhost:3000/user/verified?token=${token}`;
      await email__verify.mail__verify(
        shinobi_name,
        intro,
        instructions,
        btn_text,
        link,
        email
      );
      res
        .status(200)
        .send({ message: "Successfully Signed Up", data: newUser });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _______________________________________________________________________________________
// ___________________________________login_______________________________________________
// _______________________________________________________________________________________

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.findOne({ email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        const token = await create__token(userData._id);
        const user_return_data = {
          name: userData.shinobi_name,
          clan: userData.shinobi_clan,
          email: userData.email,
          token,
        };
        res
          .status(201)
          .send({ message: "Successfully logined", user: user_return_data });
      } else {
      }
      res.status(401).send("Incorrect Password");
    } else {
      res.status(402).send("User Does not Exists");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _________________________________verify__user__________________________________________
// _______________________________________________________________________________________

const user_verify = async (req, res) => {
  const token = req.query.token;
  const userData = await userModel.findOneAndUpdate(
    { token },
    { $set: { token: "", verified: true } }
  );
  if (userData) {
    res.status(208).json({ msg: "User Verified" });
  } else {
    res.status(408).json({ msg: "Something went wrong" });
  }
};

// _______________________________________________________________________________________
// _______________________________________________________________________________________
// _______________________________________________________________________________________
// ________________________________forgot__password_______________________________________
// _______________________________________________________________________________________

const change_password = async (req, res) => {
  try {
    const email = req.body.email;

    const token = random_string.generate();
    const user = await userModel.findOne({ email });
    const shinobi_name = user.shinobi_name;
    if (user) {
      const intro =
        "Welcome to Akatsuki, this is a mail regarding to reset your password.";
      const instructions = "To reset your password, Please click here:";
      const btn_text = "Reset Password";
      const link = `http://localhost:3000/user/reset_password?token=${token}`;
      await email__verify.mail__verify(
        shinobi_name,
        intro,
        instructions,
        btn_text,
        link,
        email
      );
      res.status(209).json({ msg: "Check your email" });
    } else {
      res.status(409).json({ msg: "User does not exist" });
    }
  } catch (error) {
    res.status(409).send(error.message);
  }
};

const reset_password = async (req, res) => {
  try {
    const token = req.query.token;
    const userData = await userModel.findOneAndUpdate(
      { token },
      { $set: { token: "" } }
    );
    if (userData) {
      const { email, password } = req.body;
      const secure_password = await hashPassword(password);
      userData.password = secure_password;
      userData.save();
    }
  } catch {}
};

module.exports = {
  signup,
  login,
  user_verify,
  change_password,
  reset_password,
};
