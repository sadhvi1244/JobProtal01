import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  const [companyToken, setCompanyToken] = useState(
    localStorage.getItem("companyToken") || null
  );
  const [companyData, setCompanyData] = useState(
    JSON.parse(localStorage.getItem("companyData")) || null
  );

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs`);
      if (data.success) setJobs(data.jobs);
      else toast.error("Error fetching jobs");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        headers: { token: companyToken },
      });
      if (data.success) {
        setCompanyData(data.company);
        localStorage.setItem("companyData", JSON.stringify(data.company));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = await getToken();
      if (!token) return console.log("Token missing, skipping fetchUserData");

      const { data } = await axios.get(`${backendUrl}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setUserData(data.user);
      else toast.error("Error fetching user data");
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch user data");
    }
  };

  // Fetch user applications
  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      if (!token)
        return console.log("Token missing, skipping fetchUserApplications");

      const { data } = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) setUserApplications(data.applications);
      else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error("Unable to fetch user applications");
    }
  };

  // Load jobs & company token
  useEffect(() => {
    fetchJobs();
    const storedCompanyToken = localStorage.getItem("companyToken");
    if (storedCompanyToken) setCompanyToken(storedCompanyToken);
  }, []);

  // Load company data
  useEffect(() => {
    if (companyToken) fetchCompanyData();
  }, [companyToken]);

  // Persist company token
  useEffect(() => {
    if (companyToken) localStorage.setItem("companyToken", companyToken);
    else {
      localStorage.removeItem("companyToken");
      localStorage.removeItem("companyData");
    }
  }, [companyToken]);

  // Load user data & applications when logged in
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
