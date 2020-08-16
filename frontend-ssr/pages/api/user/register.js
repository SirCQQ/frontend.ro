//Imports

const User = require("~/models/User.schema");
import dbConnect from "~/utils/dbConnect";
const bcrypt = require("bcryptjs");
dbConnect();
const { registerValidation } = require("~//utils/validation/userValidation");
// import UserRequests from "../../../utils/user.requests";
//Vars
const EMAIL_EXISTS_ERROR = { email: "Email already exists" };
const USERNAME_EXISTS_ERROR = { username: "Username already exists" };

export default async (req, res) => {
  let { method, body } = req;

  switch (method) {
    case "POST":
      //Desctruct and create vars
      // console.log(method, body);
      let { name, username, avatar, email, password } = { ...body };
      let { error } = registerValidation(body);
      if (error) return res.status(400).json({ message: error });
      let errors = [];
      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(password, salt);
      try {
        //Check if the email and username already exists
        const emailExists = await User.findOne({ email: body.email });
        if (emailExists) {
          errors.push(EMAIL_EXISTS_ERROR);
        }
        const usernameExists = await User.findOne({ username: body.username });
        if (usernameExists) {
          errors.push(USERNAME_EXISTS_ERROR);
        }
        if (errors.length > 0)
          return res.status(400).json({ status: "fail", errors: errors });
        //Try to save the user into the database
        //Create the user for the database
        let created_user = new User({
          name: name,
          username: username,
          avatar: avatar,
          email: email,
          password: hash_password,
        });
        let user = await created_user.save();
        res.json(user);
      } catch (err) {
        //catch the fail to save to the database
        res.status(500).json({ message: err });
      }
      break;

    default:
      res.json({
        message: "This route is for register",
      });
      break;
  }
};
