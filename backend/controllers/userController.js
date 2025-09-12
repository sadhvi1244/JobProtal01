import Job from "../models/Job.js";
import JobApplication from "../models/jobApplications.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Get user data
export const getUserData = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: User not logged in" });

  try {
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  const userId = req.auth?.userId;
  const { jobId } = req.body;

  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  if (!jobId)
    return res
      .status(400)
      .json({ success: false, message: "Job ID is required" });

  try {
    const job = await Job.findById(jobId);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const alreadyApplied = await JobApplication.findOne({ jobId, userId });
    if (alreadyApplied)
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });

    await JobApplication.create({
      userId,
      jobId,
      companyId: job.companyId,
      date: new Date(),
    });

    res
      .status(200)
      .json({ success: true, message: "Applied for the job successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user applied jobs
export const getUserJobApplications = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user resume
// Update user resume
export const updateUserResume = async (req, res) => {
  const userId = req.auth?.userId;
  if (!userId)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "resumes",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    user.resume = uploadResult.secure_url;
    await user.save();

    fs.unlinkSync(req.file.path); // remove temp file

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
