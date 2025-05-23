import { setUser } from "@/app/auth/authSlice";
import Header from "@/components/Header";
import apiClient from "@/services/apiClient";
import { Building2, Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Intro from "@/components/user/Intro";
import Contact from "@/components/user/Contact";
import EmailToggle from "@/components/EmailToggle";
import DeleteProfileCard from "@/components/DeleteProfile";


const EmployerProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [jobsCreated, setJobsCreated] = useState([]);
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const token = useSelector((state) => state.auth.token);
  const [companyDetails, setCompanyDetails] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    overview: "",
  });

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      if (!user?._id) return;

      try {
        const res = await apiClient.get(`/jobs/employer/${user._id}`);
        if (res.status === 200) {
          setJobsCreated(res.data.jobs);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchEmployerJobs();

      if (user.company) {
        setCompanyDetails(user.company);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails({ ...companyDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) return;

    try {
      if (user.company && isEditing) {
        const companyRes = await apiClient.put(
          `/company/${user.company._id}`,
          companyDetails
        );

        if (companyRes.status === 200) {
          toast.success("Company details updated");
          dispatch(
            setUser({ user: { ...user, company: companyRes.data.company } })
          );
          setIsEditing(false);
          setCompanyDetails(companyRes.data.company);
        }
      } else {
        const companyRes = await apiClient.post("/company", companyDetails);

        if (companyRes.status === 201) {
          const userUpdateRes = await apiClient.put(`/users/${user._id}`, {
            company: companyRes.data.company._id,
          });

          if (userUpdateRes.status === 200) {
            toast.success("Added company details");
            dispatch(setUser({ user: userUpdateRes.data.user }));
            setIsAddingDetails(false);
            setCompanyDetails(companyRes.data.company);
          }
        }
      }
    } catch (error) {
      console.log(error.response);
      toast.error("Failed to save company details");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto my-4 md:my-8 max-w-[1400px] w-[95%]">
        <div className="flex gap-4">
          <div className="basis-9/12">
            <Intro />

            {user.company ? (
              <section className="my-4 border p-8 rounded-md">
                <h1 className="text-2xl font-semibold mb-4">Company Details</h1>
                <div className="flex gap-4 items-center">
                  <div className="bg-gray-100 w-24 h-24 flex justify-center items-center">
                    <Building2 />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {companyDetails.name}
                    </h2>
                    <p className="text-gray-600 my-2">
                      Industry: {companyDetails.industry}
                    </p>
                    <p className="text-gray-600 my-2">
                      Location: {companyDetails.location}
                    </p>
                    <p className="text-gray-600 my-2">
                      Website:{" "}
                      <a
                        href={companyDetails.website}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {companyDetails.website}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Company Overview
                  </h2>
                  <p className="text-gray-700">{companyDetails.overview}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="border border-gray-300 bg-blue-700 p-2 px-4 rounded-md text-xs font-semibold text-white hover:bg-blue-800 mt-4 flex items-center gap-2"
                  >
                    Edit Details <Edit3 size={16} />
                  </button>
                </div>

                {isEditing && (
                  <form onSubmit={handleSubmit} className="mt-4">
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
                    Company details
                  </h1>
                  <button
                    onClick={() => setIsAddingDetails(true)}
                    className="border border-blue-600 bg-white p-2 px-4 rounded-md text-xs font-semibold text-blue-600"
                  >
                    Add details
                  </button>
                </div>
                {isAddingDetails ? (
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
                      Save details
                    </button>
                  </form>
                ) : (
                  <p>No details found</p>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="basis-3/12">
            <div className="sticky top-4">
              <Contact />
              <EmailToggle userId={user?._id} />
              <DeleteProfileCard userId={userId} token={token} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
