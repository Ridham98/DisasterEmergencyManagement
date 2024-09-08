const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongourl = 'mongodb+srv://admin:admin@cluster0.f3ezg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const JWT_SECRET = "f3587455-ef1a-4782-a851-252e6dba151c"; 

mongoose.connect(mongourl)
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

require('./UserDetails');
const User = mongoose.model("User");
const Message = require('./MessageDetails');

app.get("/", (req, res) => {
  res.send({ status: "started" });
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, country, countryCode, mobileNumber, city, code, userType } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ data: "User already exists" });
  }

  try {
    await User.create({
      firstName, lastName, email, password, country, countryCode, mobileNumber, city, code, userType
    });
    res.send({ status: "ok", data: "UserCreated" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "User doesn't exist" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(201).send({ status: "ok", data: token });
  } else {
    return res.send({ status: "error", data: "Invalid credentials" });
  }
});

app.post("/userData", async(req,res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const userEmail = user.email;

    User.findOne({ email: userEmail }).then((data) => {
      return res.send({ status: "ok", data });
    });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Route to get SOS details based on country
app.get('/sosDetails/:country', async (req, res) => {
  const { country } = req.params;
  try {
    const details = await SOSDetails.findOne({ country });
    if (!details) {
      return res.status(404).send({ status: 'error', data: 'SOS details not found for this country' });
    }
    res.send({ status: 'ok', data: details });
  } catch (error) {
    res.status(500).send({ status: 'error', data: error.message });
  }
});

// Route to get all admin users
app.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ userType: 'admin' });
    res.send({ status: 'ok', data: admins });
  } catch (error) {
    res.status(500).send({ status: 'error', data: error.message });
  }
});

// Route to send a message to all admins
app.post('/sendMessageToAdmins', async (req, res) => {
  const { message, issue, fullName } = req.body;

  if (!message || !issue) {
    return res.status(400).send({ status: 'error', data: 'Message and issue are required' });
  }

  try {
    // Save the message to the database
    const newMessage = new Message({ issue, fullName, message });
    await newMessage.save();

    res.send({ status: 'ok', data: 'Message stored for all admins' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).send({ status: 'error', data: error.message });
  }
});

app.get('/getMessages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: -1 }); // Get messages, newest first
    res.send(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send({ status: 'error', data: error.message });
  }
});


app.listen(5001, () => {
  console.log("Node.js server started on port 5001.");
});
