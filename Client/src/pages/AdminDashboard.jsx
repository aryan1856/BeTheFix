import React, { useState } from "react";
import { useComplaints } from "./ComplaintContext";
import ComplaintCard from "./ComplaintCard";
import { Filter, AlertCircle, Check, X, Clock } from "lucide-react";

const AdminDashboard = () => {
  const { complaints } = useComplaints();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredComplaints = complaints
    .filter(
      (complaint) => statusFilter === "all" || complaint.status === statusFilter
    )
    .sort((a, b) => b.upvotes - a.upvotes);

  const statusCounts = {
    all: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    neglected: complaints.filter((c) => c.status === "neglected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Make filter section sticky below the main navbar */}
      <div className="sticky top-[6rem] z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="bg-white p-4 md:p-6 border border-gray-100">
          <div className="flex items-center mb-3">
            <Filter className="h-5 w-5 text-gray-700 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Filter by Status
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {/* All complaints filter */}
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 ${statusFilter === "all"
                  ? "bg-gray-800 text-white border-gray-800 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <span className="font-medium text-sm">All</span>
              <span
                className={`ml-2 text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${statusFilter === "all"
                    ? "bg-white bg-opacity-20"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {statusCounts.all}
              </span>
            </button>

            {/* Open complaints filter */}
            <button
              onClick={() => setStatusFilter("open")}
              className={`flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 ${statusFilter === "open"
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <Clock
                className={`h-4 w-4 ${statusFilter === "open" ? "text-white" : "text-amber-500"
                  } mr-2`}
              />
              <span className="font-medium text-sm">Open</span>
              <span
                className={`ml-2 text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${statusFilter === "open"
                    ? "bg-white bg-opacity-20"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {statusCounts.open}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("resolved")}
              className={`flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 ${statusFilter === "resolved"
                  ? "bg-green-500 text-white border-green-500 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <Check
                className={`h-4 w-4 ${statusFilter === "resolved" ? "text-white" : "text-green-600"
                  } mr-2`}
              />
              <span className="font-medium text-sm">Resolved</span>
              <span
                className={`ml-2 text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${statusFilter === "resolved"
                    ? "bg-white bg-opacity-20"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {statusCounts.resolved}
              </span>
            </button>

            {/* Neglected complaints filter */}
            <button
              onClick={() => setStatusFilter("neglected")}
              className={`flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 ${statusFilter === "neglected"
                  ? "bg-red-500 text-white border-red-500 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
            >
              <X
                className={`h-4 w-4 ${statusFilter === "neglected" ? "text-white" : "text-red-500"
                  } mr-2`}
              />
              <span className="font-medium text-sm">Neglected</span>
              <span
                className={`ml-2 text-xs sm:text-sm font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${statusFilter === "neglected"
                    ? "bg-white bg-opacity-20"
                    : "bg-gray-100 text-gray-800"
                  }`}
              >
                {statusCounts.neglected}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Complaints Section */}
          {filteredComplaints.length === 0 ? (
            <div className="bg-white rounded-xl shadow-xs p-8 text-center border border-gray-100 mt-4">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No complaints found
              </h3>
              <p className="text-gray-500">
                {statusFilter === "all"
                  ? "There are no complaints in the system yet."
                  : `There are no ${statusFilter} complaints at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          )}

          {/* Footer Section */}
          <footer className="mt-8 text-center text-xl text-gray-500 border-t border-gray-200 pt-6 pb-4">
            <p>🌱 Together, we clean. Together, we thrive 🌱 </p>
            <p className="mt-1 italic text-green-600 font-medium">Be the solution, not the pollution.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;