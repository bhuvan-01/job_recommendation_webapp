import { Button } from "@/components/ui/button";
import apiClient from "@/services/apiClient";
import { Banknote, Info, MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EmployerJobDetailed = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/jobs/${id}`);
        setJob(res.data.job);
        console.log("Job detailed: ", res.data);

        if (res.status === 2000) [setIsLoading(false)];
      } catch (error) {
        console.log(error);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await apiClient(`/applications/job/${id}`);
        console.log("app rezz: ", res);

        if (res.status === 200) {
          setApplicants(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchJob();
    fetchApplications();

    return () => {
      setJob({});
    };
  }, [id]);

  if (!isLoading) return <div>Loading...</div>;

  return (
    <div className="container w-full max-w-[1400] flex gap-4 ">
      <div className="grow md:basis-8/12 my-4 mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{job?.title}</h1>
          <Button
            onClick={() => navigate("/dashboard/employer/jobs/edit/" + job._id)}
            title="Edit"
            variant="ghost"
            className="p-3 flex gap-2 items-center"
          >
            Edit job <Pencil size={12} />
          </Button>
        </div>
        <p className="text-gray-600 mb-4">{job?.description}</p>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Requirements:</h2>
          <ul className="flex flex-wrap gap-2 items-center">
            {job?.requirements?.map((requirement, index) => (
              <li
                key={index}
                className="text-gray-700 bg-gray-100 p-2 px-4 rounded-full w-fit text-sm "
              >
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Job Details:</h2>

          <div className="grid grid-cols-4 gap-2 my-4">
            <article className="text-gray-700 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-lg flex gap-1 items-center">
                <MapPin size={18} />
                Location:
              </h3>
              <p>{job.location}</p>
            </article>
            <article className="text-gray-700 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-lg flex gap-1  items-center">
                <Banknote size={18} />
                Salary:
              </h3>
              <p>{job.salary}</p>
            </article>

            <article className="text-gray-700 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-lg flex gap-1 items-center">
                <Info size={18} /> Experience
              </h3>
              <p>{job.experience}</p>
            </article>
            <article className="text-gray-700 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-lg">Industry:</h3>
              <p>{job.industry}</p>
            </article>
            <article className="text-gray-700 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-lg">Job Type:</h3>
              <p>{job.jobType}</p>
            </article>
            <article className="text-gray-700 bg-gray-100 p-4 rounded-md">
              <h3 className="font-medium text-lg">Location Type:</h3>{" "}
              <p>{job.locationType}</p>
            </article>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Company Information:</h2>
          <p className="text-gray-700">
            <strong>Name:</strong> {job?.company?.name}
          </p>
          <p className="text-gray-700">
            <strong>Industry:</strong> {job?.company?.industry}
          </p>
          <p className="text-gray-700">
            <strong>Location:</strong> {job?.company?.location}
          </p>
          <p className="text-gray-700">
            <strong>Website:</strong>{" "}
            <a href={job?.company?.website} className="text-blue-500">
              {job?.company?.website}
            </a>
          </p>
          <p className="text-gray-700">
            <strong>Overview:</strong> {job?.company?.overview}
          </p>
        </div>
        <p className="text-gray-600 text-sm">
          Last updated: {new Date(job?.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="basis-4/12 my-4 p-6">
        <h1 className="text-2xl mb-4">
          Applicants ({job?.applications?.length})
        </h1>
        {applicants?.length > 0 ? (
          applicants.map((app) => (
            <div
              className="bg-gray-100 p-2 pl-4 rounded-md border flex justify-between items-center"
              key={app._id}
            >
              <h1>{app?.applicant?.fullName}</h1>

              <Link to={`/dashboard/employer/jobs/applications/${app._id}`}>
                <Button>View</Button>
              </Link>
            </div>
          ))
        ) : (
          <p>No applications</p>
        )}
      </div>
    </div>
  );
};

export default EmployerJobDetailed;
