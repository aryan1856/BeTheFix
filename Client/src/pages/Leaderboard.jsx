import React, { useEffect, useState } from "react";
import LeaderboardList from "../components/LeaderBoardList";
import toast from 'react-hot-toast';
import axios from "axios";
import { useSelector } from "react-redux";

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { longitude, latitude } = useSelector((store) => store.location);

  useEffect(() => {
    const fetchUsersByLocation = async () => {
      if (latitude && longitude) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
            latitude,
            longitude,
          });

          if (res.data?.users) {
            setUsers(res.data.users);
          }
        } catch (error) {
          // console.error("Error fetching users by location:", error);
          toast.error(error.message)
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsersByLocation();
  }, [latitude, longitude]);

  if (loading || !latitude || !longitude) {
    return <div className="p-6 text-center text-gray-600">Loading leaderboard...</div>;
  }

  return <LeaderboardList users={users} />;
};

export default LeaderboardPage;
