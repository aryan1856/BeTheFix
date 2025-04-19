import React from "react";

const ProfileAbout = ({ LoggedInUser }) => {
  if (!LoggedInUser) return <div>Loading...</div>;
  console.log(LoggedInUser);
  return (
    <div className="mt-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        {/* Remove Avatar */}
        <div>
          <p className="text-gray-600">{LoggedInUser.loggedinUser.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-800">
        <div>
          <span className="font-semibold">Gender:</span> {LoggedInUser.loggedinUser.gender || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Age:</span> {LoggedInUser.loggedinUser.age || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Address:</span> {`${LoggedInUser.loggedinUser.location.area}, 
          ${LoggedInUser.loggedinUser.location.city}, 
          ${LoggedInUser.loggedinUser.location.country}`|| "N/A"}
        </div>
        <div>
          <span className="font-semibold">Volunteer:</span>{" "}
          {LoggedInUser.loggedinUser.isVolunteer ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-semibold">Badges:</span> {LoggedInUser.loggedinUser.badges}
        </div>
        <div>
          <span className="font-semibold">Resolved Issues:</span> {LoggedInUser.loggedinUser.resolvedCount}
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;