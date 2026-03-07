const User = require("../models/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerSchema = require("./validation/registerSchema");

const saltRounds = parseInt(process.env.SALTROUNDS) || 10;

const registerUser = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    // get user data
    const { username, email, password, role } = req.body;
    // validate data
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Invalid Data" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ msg: "Account Already Exist" });
    }
    if (password.length < 6)
      return res.status(400).json({ msg: "Password is too small" });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    // Response
    res.status(201).json({ msg: "Created Done!", data: user });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "Missing Data" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "User Not Found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ msg: "Invalid Password" });

    const token = jwt.sign({
      id: user._id,
      role: user.role,
      expiresIn: "1d",
    });

    res.status(200).json({ msg: "Login successfully", token });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerUser, loginUser };
