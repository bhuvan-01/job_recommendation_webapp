import { Button } from "@/components/ui/button";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "./Pagination"; // Import the Pagination component

const EmployerAllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Pagination: Current page index (0-based)
  const [pageSize, setPageSize] = useState(5); // Pagination: Items per page

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get("/applications/all");
        console.log("All applications response:", res.data);

        if (res.status === 200) {
          setApplications(res.data.applications || []);
        } else {
          console.error("Unexpected status code:", res.status);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (appId) => {
    try {
      const res = await apiClient.delete(`/applications/${appId}`);
      if (res.status === 200) {
        setApplications((currentApps) =>
          currentApps.filter((app) => app._id !== appId)
        );
      } else {
        console.error("Failed to delete application", res.status);
      }
    } catch (error) {
      console.error("Error deleting application:", error.response || error);
    }
  };

  // Pagination logic
  const pageCount = Math.ceil(applications.length / pageSize);
  const currentApplications = applications.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container w-full max-w-[1400px] mx-auto min-h-screen flex flex-col bg-white">
      <h1 className="text-2xl mb-4 font-bold">All Applications</h1>
      {currentApplications.length > 0 ? (
        currentApplications.map((app) => (
          <div
            className="bg-gray-100 p-4 pl-6 rounded-md border flex justify-between items-center mb-4"
            key={app._id}
          >
            <div>
              <h1 className="font-semibold text-lg">
                {app?.applicant?.fullName || "Unnamed Applicant"}
              </h1>
              <p className="text-gray-600">
                Job Title: {app?.job?.title || "Untitled Job"}{" "}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/jobs/applications/${app._id}`}>
                <Button className="text-right bg-blue-500">View</Button>
              </Link>
              <Button onClick={() => handleDelete(app._id)} className="ml-4 bg-blue-500">
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p>No applications found.</p>
      )}

      {/* Pagination Controls */}
      <div className="mt-auto">
        <Pagination
          canPreviousPage={currentPage > 0}
          canNextPage={currentPage < pageCount - 1}
          pageOptions={Array.from({ length: pageCount }, (_, i) => i + 1)}
          pageCount={pageCount}
          gotoPage={setCurrentPage}
          nextPage={() => setCurrentPage(currentPage + 1)}
          previousPage={() => setCurrentPage(currentPage - 1)}
          pageIndex={currentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
};

export default EmployerAllApplications;
