import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import UserProfile from "../components/ProfileMainComponent";
import ProfileTabContent from "../components/profile_components/ProfileTabContent";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("Posts");
  const LoggedInUser = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/u`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        if (!response.data.success) {
          throw new Error(`Error: ${response.status}`);
        }

        setPosts(response.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <UserProfile
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        LoggedInUser={LoggedInUser}
      />
      <ProfileTabContent
        activeTab={activeTab}
        posts={posts}
        LoggedInUser={LoggedInUser}
      />
    </div>
  );
};

export default Profile;
