import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Building2, Linkedin, Plus, User, Edit3 } from "lucide-react";
import Header from "@/components/Header";
import apiClient from "@/services/apiClient";
import { setUser } from "@/app/auth/authSlice";
import toast from "react-hot-toast";

const EmployerProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [jobsCreated, setJobsCreated] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    overview: "",
  });

  useEffect(() => {
    if (user?.company) {
      setCompanyDetails(user.company); 
    }
  }, [user?.company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = user?.company
      ? `/company/${user.company._id}`
      : "/company";
    const method = user?.company ? "put" : "post";

    try {
      const response = await apiClient[method](endpoint, companyDetails);
      if (response.status === 200 || response.status === 201) {
        toast.success("Company details updated!");
        dispatch(setUser({ ...user, company: response.data.company }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error.response || error);
      if (error.response && error.response.status === 404) {
        toast.error(
          "Company not found. It may have been deleted or does not exist."
        );
      } else {
        toast.error("Failed to update company details. Please try again.");
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto my-4 md:my-8 max-w-[1400px] w-[95%]">
        <div className="flex gap-4">
          <div className="basis-9/12">
            <section className="border p-8 rounded-md">
              <div className="flex gap-8 items-center">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex justify-center items-center">
                  <User />
                </div>
                <div className="py-2">
                  <h1 className="text-3xl font-semibold mb-2">
                    {user?.fullName}
                  </h1>
                  <p className="text-gray-600 my-2">{user?.bio || "No bio"}</p>
                  <div className="flex gap-6 mt-4">
                    <a
                      href="https://www.linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin
                        size={24}
                        className="text-gray-600 hover:text-blue-600"
                      />
                    </a>
                  </div>
                </div>
                <div className="ml-auto">
                  <Link
                    to="/dashboard/employer/jobs/add"
                    className="p-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-800 flex justify-center items-center gap-2"
                  >
                    Post a job <Plus />
                  </Link>
                </div>
              </div>
            </section>

            {user?.company ? (
              <section className="my-4 border p-8 rounded-md">
                <div className="flex gap-4 items-center">
                  <div className="bg-gray-100 w-24 h-24 flex justify-center items-center">
                    <Building2 />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {user.company.name}
                    </h2>
                    <p className="text-gray-600 my-2">
                      Industry: {user.company.industry}
                    </p>
                    <p className="text-gray-600 my-2">
                      Location: {user.company.location}
                    </p>
                    <p className="text-gray-600 my-2">
                      Website:{" "}
                      <a
                        href={user.company.website}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {user.company.website}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Company Overview
                  </h2>
                  <p className="text-gray-700">{user.company.overview}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="border border-gray-300 bg-blue-700 p-2 px-4 rounded-md text-xs font-semibold text-white hover:bg-blue-800"
                  >
                    Edit Details <Edit3 size={16} />
                  </button>
                </div>

                {isEditing && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={companyDetails.name}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={companyDetails.industry}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={companyDetails.location}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={companyDetails.website}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Company Overview
                      </label>
                      <textarea
                        name="overview"
                        value={companyDetails.overview}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md"
                        rows="3"
                      />
                    </div>
                    <button
                      type="submit"
                      className="border border-blue-600 bg-blue-600 text-white p-2 px-4 rounded-md text-xs font-semibold"
                    >
                      Save Details
                    </button>
                  </form>
                )}
              </section>
            ) : (
              <section className="my-4 border p-8 rounded-md">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold mb-2">
                    Add Company Details
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="border border-blue-600 bg-white p-2 px-4 rounded-md text-xs font-semibold text-blue-600"
                  >
                    Add Details
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                </form>
              </section>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
