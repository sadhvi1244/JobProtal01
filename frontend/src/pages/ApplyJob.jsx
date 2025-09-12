import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { assets } from "../assets/assets";
import kconvert from "k-convert";
import moment from "moment";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    backendUrl,
    jobs,
    userData,
    userApplications,
    fetchUserApplications,
  } = useContext(AppContext);
  const { getToken } = useAuth();

  const [jobData, setJobData] = useState(null);
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

  // Fetch single job
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
      if (data.success) setJobData(data.job);
      else toast.error("Error fetching job");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Check if user already applied
  const checkAlreadyApplied = () => {
    if (!jobData) return;
    const applied = userApplications.some(
      (app) => app.jobId._id === jobData._id
    );
    setIsAlreadyApplied(applied);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    checkAlreadyApplied();
  }, [jobData, userApplications]);

  // Apply for job
  const applyHandler = async () => {
    try {
      if (!userData) return toast.error("Login to apply for jobs");
      if (!userData.resume) {
        navigate("/applications");
        return toast.error("Upload your resume to apply for jobs");
      }

      const token = await getToken();
      if (!token) return toast.error("Authentication token missing");

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Applied for the job");
        fetchUserApplications();
      } else toast.error(data.message || "Error applying for job");
    } catch (err) {
      if (err.response?.data?.message) toast.error(err.response.data.message);
      else toast.error("Internal error");
    }
  };

  if (!jobData) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto">
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <img
                className="h-24 bg-white rounded-lg p-4 mr-4 max-md:mb-4 border"
                src={jobData.companyId.image}
              />
              <div className="text-center md:text-left text-neutral-700">
                <h2 className="text-2xl sm:text-4xl font-medium">
                  {jobData.title}
                </h2>
                <div className="flex flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <img src={assets.suitcase_icon} /> {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.location_icon} /> {jobData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.person_icon} /> {jobData.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <img src={assets.money_icon} /> CTC:{" "}
                    {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              <button
                onClick={applyHandler}
                className="bg-blue-600 hover:bg-blue-800 p-3 px-10 text-white rounded-xl"
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
              <p className="mt-1 text-gray-600">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            <div className="w-full lg:w-2/3">
              <h2 className="font-bold mb-4 text-3xl">Job Description</h2>
              <div
                className="job-description"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />
              <button
                onClick={applyHandler}
                className="bg-blue-600 hover:bg-blue-800 p-3 mt-10 px-10 text-white rounded-xl"
              >
                {isAlreadyApplied ? "Already Applied" : "Apply Now"}
              </button>
            </div>

            {/* More jobs */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2>More jobs from {jobData.companyId.name}</h2>
              {jobs
                .filter(
                  (job) =>
                    job._id !== jobData._id &&
                    job.companyId._id === jobData.companyId._id
                )
                .filter((job) => {
                  const appliedJobsIds = new Set(
                    userApplications.map((app) => app.jobId?._id)
                  );
                  return !appliedJobsIds.has(job._id);
                })
                .slice(0, 4)
                .map((job, index) => (
                  <JobCard key={index} job={job} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;
