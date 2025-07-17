import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import axios from "axios";
import stream from "stream";
import { cloudinary } from "../cloudConfig.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument({ margin: 50 });
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const writeStream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(writeStream);

  try {
    const response = await axios.get(userData.userId.profilePicture, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data, "binary");
    doc.image(imageBuffer, doc.page.width / 2 - 50, 20, {
      width: 100,
      height: 100,
    });
  } catch (err) {
    console.warn("⚠️ Failed to load profile picture:", err.message);
  }

  doc.moveDown(6);

  // Name and Meta
  doc
    .fontSize(20)
    .fillColor("#2c3e50")
    .text(userData.userId.name, { align: "center" });

  doc
    .fontSize(12)
    .fillColor("gray")
    .text(`@${userData.userId.username} | ${userData.userId.email}`, {
      align: "center",
    });

  doc
    .moveDown(1)
    .strokeColor("#ccc")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();

  doc.moveDown(2);

  // Bio and Current Post
  doc.fontSize(14).fillColor("#000").text("Bio", { underline: true });
  doc
    .fontSize(12)
    .fillColor("#333")
    .text(userData.bio || "N/A");

  doc.moveDown();
  doc.fontSize(14).fillColor("#000").text("Current Post", { underline: true });
  doc
    .fontSize(12)
    .fillColor("#333")
    .text(userData.currentPost || "N/A");

  // Past Work
  if (userData.pastWork?.length) {
    doc.moveDown(2);
    doc.fontSize(14).fillColor("#000").text("Past Work", { underline: true });

    userData.pastWork.forEach((work) => {
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .fillColor("#444")
        .text(`• Company: ${work.company}`)
        .text(`  Position: ${work.position}`)
        .text(`  Years: ${work.years}`);
    });
  }

  // Education
  if (userData.education?.length) {
    doc.moveDown(2);
    doc.fontSize(14).fillColor("#000").text("Education", { underline: true });

    userData.education.forEach((edu) => {
      doc.moveDown(0.5);
      doc
        .fontSize(12)
        .fillColor("#444")
        .text(`• School: ${edu.school}`)
        .text(`  Degree: ${edu.degree}`)
        .text(`  Field of Study: ${edu.fieldOfStudy}`);
    });
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve(outputPath));
    writeStream.on("error", reject);
  });
};

export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      console.log("Missing fields:", { name, email, password, username }); // Debugging
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({ message: "User is already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    return res.json({ token: token });
  } catch (error) {}
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.path;

    await user.save();

    return res.json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    Object.assign(user, newUserData);

    await user.save();
    return res.json({ message: " User Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );
    return res.json({ userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.json({ message: "Profile updated " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name username email profilePicture"
  );

  let outputPath = await convertUserDataToPDF(userProfile);
  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionsRequests = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name username email profilePicture");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name username email profilePicture");
    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();

    return res.json({ message: "Request Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );
    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
