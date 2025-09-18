import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(false);
  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);
  const { setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (state === "Sign Up" && !isTextDataSubmitted) {
      return setIsTextDataSubmitted(true);
    }

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/company/login", {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          toast.success("Logged in successfully");
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        if (image) {
          formData.append("image", image);
        }

        const { data } = await axios.post(
          backendUrl + "/api/company/register",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          toast.success("Account created successfully");
          navigate("/dashboard");
        } else {
          toast.error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/40">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4 flex flex-col gap-4"
      >
        <img
          onClick={() => setShowRecruiterLogin(false)}
          src={assets.cross_icon}
          className="absolute top-4 right-4 w-4 h-4 cursor-pointer"
          alt="Close"
        />
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Recruiter {state}
        </h1>
        <p className="text-center text-sm text-gray-500">
          Welcome back! Please sign in to continue
        </p>
        {state === "Sign Up" && isTextDataSubmitted ? (
          <div className="flex items-center gap-4 my-4">
            <label htmlFor="image" className="cursor-pointer">
              <img
                className="w-16 h-16 rounded-full object-cover border"
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt="Company logo preview"
              />
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                accept="image/*"
              />
            </label>
            <p className="text-sm text-gray-600">
              Upload Company <br />
              logo
            </p>
          </div>
        ) : (
          <>
            {state !== "Login" && (
              <div className="flex items-center border border-gray-300 rounded-lg p-3">
                <img
                  src={assets.person_icon}
                  alt="Person icon"
                  className="w-5 h-5 mr-3 opacity-70"
                />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Company Name"
                  required
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500"
                />
              </div>
            )}
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <img
                src={assets.email_icon}
                alt="Email icon"
                className="w-5 h-5 mr-3 opacity-70"
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
                required
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg p-3">
              <img
                src={assets.lock_icon}
                alt="Lock icon"
                className="w-5 h-5 mr-3 opacity-70"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-500"
              />
            </div>
          </>
        )}
        {state === "Login" && (
          <p className="text-sm text-blue-600 hover:text-blue-800 my-2 cursor-pointer text-right">
            Forgot password?
          </p>
        )}
        <button
          type="submit"
          className="mt-3 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {state === "Login"
            ? "Login"
            : isTextDataSubmitted
            ? "Create Account"
            : "Next"}
        </button>
        {state === "Login" ? (
          <p className="mt-3 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-3 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => {
                setState("Login");
                setIsTextDataSubmitted(false);
              }}
            >
              Login
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default RecruiterLogin;
