import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const usePosts = (category = "") => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {longitude, latitude} = useSelector((state) => state.location);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!longitude || !latitude) {
        setError("Location is not available");
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setError(null);
  
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
          longitude, latitude
        }, {
          withCredentials: true
        });
  
        const allPosts = res.data;
  
        const filtered = category
          ? allPosts.filter((p) => p.category === category)
          : allPosts;
  
        setPosts(filtered);
      } catch (err) {
        console.error("Post fetching error:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, [ longitude, latitude]); // Include location in dependency
  

  return { posts, loading, error };
};

export default usePosts;
