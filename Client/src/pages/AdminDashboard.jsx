import React, { useEffect, useState } from "react";
import axios from "axios";
import ComplaintCard from "./ComplaintCard";
import { Filter, AlertCircle, Check, X, Clock } from "lucide-react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const LoggedInUser = useSelector((state) => state.user);

  const MUNCIPALITY_API = `${import.meta.env.VITE_BACKEND_URL}/api/admin/getmunicipalityposts`;
  const ADMIN_API = `${import.meta.env.VITE_BACKEND_URL}/api/admin/getadminposts`;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          LoggedInUser.loggedinUser.departmentType === "Municipality"
            ? MUNCIPALITY_API
            : ADMIN_API,
          { withCredentials: true }
        );
        console.log(res);
        setComplaints(res.data.posts || []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [LoggedInUser.loggedinUser.departmentType]);

  const filteredComplaints = complaints
    .filter((complaint) =>
      statusFilter === "All" ? true : complaint.status.state === statusFilter
    )
    .sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));

  const statusOptions = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

  const statusCounts = statusOptions.reduce((acc, status) => {
    acc[status] =
      status === "All"
        ? complaints.length
        : complaints.filter((c) => c.status.state === status).length;
    return acc;
  }, {});

  const statusIcons = {
    Pending: <Clock className="h-4 w-4 text-amber-500 mr-2" />,
    "In Progress": <Clock className="h-4 w-4 text-blue-500 mr-2" />,
    Resolved: <Check className="h-4 w-4 text-green-600 mr-2" />,
    Rejected: <X className="h-4 w-4 text-red-500 mr-2" />,
  };

  const getButtonClasses = (status) =>
    `flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 ${
      statusFilter === status
        ? "bg-gray-800 text-white border-gray-800 shadow-sm"
        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-[6rem] z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="bg-white p-4 md:p-6 border border-gray-100">
          <div className="flex items-center mb-3">
            <Filter className="h-5 w-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Filter by Status</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={getButtonClasses(status)}
              >
                {status !== "All" && statusIcons[status]}
                <span className="font-medium text-sm">{status}</span>
                <span
                  className={`ml-2 text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${
                    statusFilter === status
                      ? "bg-white bg-opacity-20"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusCounts[status]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl shadow-xs p-8 text-center border border-gray-100 mt-4">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-500">
                {statusFilter === "All"
                  ? "There are no complaints in the system yet."
                  : `There are no ${statusFilter} complaints at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint._id} complaint={complaint} />
              ))}
            </div>
          )}

          <footer className="mt-8 text-center text-xl text-gray-500 border-t border-gray-200 pt-6 pb-4">
            <p>🌱 Together, we clean. Together, we thrive 🌱</p>
            <p className="mt-1 italic text-green-600 font-medium">
              Be the solution, not the pollution.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
