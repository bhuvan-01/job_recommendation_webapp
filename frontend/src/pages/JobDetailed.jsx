import { Button } from "@/components/ui/button";
import apiClient from "@/services/apiClient";
import { Banknote, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { incrementJobViewCount } from "@/app/jobs/jobSlice";

const JobDetailed = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get(`/jobs/${id}`);
        setJob(res.data.job);
        dispatch(incrementJobViewCount({ jobId: res.data.job._id }));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id, dispatch]);

  const handleJobApply = (job) => {
    if (job.externalLink) {
      window.location.href = job.externalLink;
    } else {
      navigate(`/apply/${job._id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!job) {
    return <div className="text-center mt-10">Job not found</div>;
  }

  const isJobApplied = job.applications?.some((app) => app.user === user?._id);

  return (
    <div className="container mx-auto w-full max-w-[1400px] bg-white p-6 mt-6">
      <div className="w-full">
        {/* Left Column */}
        <div className="space-y-4">
          <section className="bg-blue-500 shadow-md text-white p-8 rounded-md">
            <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
            <p className="text-xs text-gray-300">
              Posted on {new Date(job.createdAt).toLocaleDateString()}
            </p>

            <div className="flex gap-2 items-center flex-wrap my-4">
              <p className="flex gap-1 items-center text-sm">
                <MapPin size={14} /> {job.location}
              </p>
              {"•"}
              <p className="flex gap-1 items-center text-sm">
                <Banknote size={18} />${job.salary}
              </p>
              {"•"}
              <p className="text-sm">{job.jobType}</p>
              {"•"}
              <p className="text-sm">{job.experience}</p>
            </div>

            <p>{job.applications?.length || 0} applicants</p>
          </section>

          <section className="md:flex gap-4">
            <div className="basis-8/12 space-y-4">
              <h2 className="text-xl font-medium">Description:</h2>
              <p>{job.description}</p>

              <h2 className="text-xl font-medium">Requirements:</h2>
              <ul className="flex gap-2 items-center flex-wrap my-4">
                {job.requirements?.map((requirement, index) => (
                  <li
                    key={index}
                    className="bg-gray-100 rounded-full w-fit text-xs border p-1 px-3"
                  >
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleJobApply(job)}
                  className="px-8 basis-1/2 md:basis-auto"
                  disabled={isJobApplied}
                >
                  {isJobApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </div>
            {/* Right Column */}
            <div className="my-4 md:m-0 md:p-4 basis-4/12 bg-gray-50">
              <h2 className="text-xl font-medium">{job.company?.name}</h2>
              <p>{job.company?.location}</p>
              <p>
                <strong>Industry: </strong>
                {job.company?.industry}
              </p>
              <p>
                <strong>Website: </strong>
                <a href={job.company?.website} className="text-blue-500">
                  {job.company?.website}
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetailed;
