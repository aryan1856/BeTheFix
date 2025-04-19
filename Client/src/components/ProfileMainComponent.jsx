import React, { useState } from "react";
import axios from 'axios';

const UserProfile = ({ activeTab, setActiveTab, LoggedInUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    fullName: LoggedInUser.loggedinUser.fullName,
    address: LoggedInUser.loggedinUser.address,
    age: LoggedInUser.loggedinUser.age
  });

  const tabs = ["Posts", "About", "Badges","Volunteered Posts"];

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update`,
        editData,
        {
          withCredentials: true,
        }
      );
      console.log("Profile updated successfully:", res.data);
      // Optionally update UI or parent state here
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md">
      {/* Profile Info */}
      <div className="flex flex-col items-center gap-1">
        <img
          src={LoggedInUser.loggedinUser.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow"
        />
        <h2 className="text-xl font-semibold">{LoggedInUser.loggedinUser.fullName}</h2>
        <p className="text-gray-600 text-sm text-center px-2">
          {(LoggedInUser.loggedinUser.location.area || LoggedInUser.loggedinUser.location.city) + ","+LoggedInUser.loggedinUser.location.country}
        </p>
        <button
          className="mt-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 border-b">
        <ul className="flex justify-around text-gray-600 text-sm">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 cursor-pointer transition-all ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 font-semibold text-black"
                  : "hover:border-b-2 hover:border-gray-300"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                className="w-full px-3 py-1 border rounded"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                className="w-full px-3 py-1 border rounded"
                value={editData.address}
                onChange={(e) =>
                  setEditData({ ...editData, address: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Age</label>
              <input
                type="number"
                className="w-full px-3 py-1 border rounded"
                value={editData.age}
                onChange={(e) =>
                  setEditData({ ...editData, age: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
