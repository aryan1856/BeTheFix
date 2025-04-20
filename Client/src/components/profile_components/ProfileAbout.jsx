import React from "react";

const ProfileAbout = ({ LoggedInUser }) => {
  if (!LoggedInUser) return <div className="text-center mt-10">Loading...</div>;

  const user = LoggedInUser.loggedinUser;

  // console.log(user);

  return (
    <div className="mt-10 max-w-4xl mx-auto px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          Profile Overview
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
            <span className="font-semibold">Gender:</span> {user.gender || "N/A"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
            <span className="font-semibold">Age:</span> {user.age || "N/A"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
            <span className="font-semibold">Address:</span>{" "}
            {user.location
              ? `${user.location.area}, ${user.location.city}, ${user.location.country}`
              : "N/A"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
            <span className="font-semibold">Volunteer:</span>{" "}
            {user.volunteeredAndResolved > 0
 ? "Yes" : "No"}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
            <span className="font-semibold">Badges:</span> {user.badges}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
            <span className="font-semibold">Resolved Issues:</span> {user.resolvedCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
