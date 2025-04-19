import React, { useState, useEffect } from "react";
import axios from "axios";

const ResolvedIssues = () => {
  const [resolved, setResolved] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchResolvedData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/getallresolvedposts`, {
          withCredentials: true, 
        });
        setResolved(res.data.data);
      } catch (err) {
        console.error("Error fetching resolved issues:", err);
      }
    };
  
    fetchResolvedData();
  }, []);
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-10 px-4 bg-gradient-to-br from-white to-[#f0f9ff]">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-10 tracking-tight text-center">
        Issues Resolved by Volunteers
      </h1>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl">
        {resolved.map((issue, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-5 transition hover:shadow-2xl"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center">
              Resolved by{" "}
              <span className="text-[#2cb1bc]">{issue.fullName}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div
                className="rounded-xl overflow-hidden border border-gray-200 hover:border-[#2cb1bc] transition cursor-pointer"
                onClick={() => setSelectedImg(issue.postImage)}
              >
                <div className="aspect-[4/3] w-full">
                  <img
                    src={issue.postImage}
                    alt="Before"
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-center mt-2 font-medium text-gray-600">
                  Before
                </p>
              </div>

              {/* After */}
              <div
                className="rounded-xl overflow-hidden border border-gray-200 hover:border-[#2cb1bc] transition cursor-pointer"
                onClick={() => setSelectedImg(issue.resolvedImage)}
              >
                <div className="aspect-[4/3] w-full">
                  <img
                    src={issue.resolvedImage}
                    alt="After"
                    className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-center mt-2 font-medium text-gray-600">
                  After
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500 italic">
              {issue.remarks}
            </p>
          </div>
        ))}
      </div>

      {/* Image zoom modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4"
          onClick={() => setSelectedImg(null)}
        >
          <img
            src={selectedImg}
            alt="Zoomed"
            className="w-full sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ResolvedIssues;
