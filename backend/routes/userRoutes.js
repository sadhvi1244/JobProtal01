import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Get user data (authenticated)
router.get("/user", requireAuth(), getUserData);

// Apply for a job (authenticated)
router.post("/apply", requireAuth(), applyForJob);

// Get user applied jobs (authenticated)
router.get("/applications", requireAuth(), getUserJobApplications);

// Update user resume (authenticated)
router.post(
  "/update-resume",
  requireAuth(),
  upload.single("resume"),
  updateUserResume
);

export default router;
