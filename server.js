require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const resumeSchema = require("./models/resumeSchema");

// MongoDB URI from .env
const URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route to add a resume title
app.post("/addTitle", async (req, res) => {
  try {
    const { resumetitle, uuid, useremail, name } = req.body;

    // Validate required fields
    if (!resumetitle || !uuid || !useremail || !name) {
      return res.status(400).send({ error: "resumetitle and uuid are required." });
    }

    // Create and save the ResumeTitle document
    const title = new resumeSchema({ resumetitle, uuid, useremail, name });
    await title.save();

    // Respond with the saved document
    res.status(201).send(title);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "An error occurred while saving the data." });
  }
});

app.get('/getdata', async (req, res) => {
  const email = req.query.useremail;
  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required' });
  }
  try {
    const resumes = await resumeSchema.find({ useremail: email });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

app.put('/updateresume/:id/edit', async (req, res) => {
  try {
    let data = await resumeSchema.updateOne({ _id: req.params.id },
      { $set: req.body }
    );
    res.send({ Success: "Data Updated Successfully" });
  }
  catch {
    res.send({ Status: "Unable to update date" });
  }
});

app.put('/updater/:id/edit', async (req, res) => {
  const resumeId = req.params.id;
  const { experience } = req.body;

  if (!Array.isArray(experience)) {
    return res.status(400).json({ error: "Experience must be an array" });
  }

  try {
    const updatedResume = await resumeSchema.findByIdAndUpdate(
      resumeId,
      { $set: { experience } },
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.status(200).json({ message: "Experience updated", resume: updatedResume });
  } catch (err) {
    console.error("❌ Error updating experience:", err);
    res.status(500).json({ error: "Server error updating experience" });
  }
});


app.get('/viewresume/:id/edit', async (req, res) => {
  try {
    const resume = await resumeSchema.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(200).json({ data: resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
