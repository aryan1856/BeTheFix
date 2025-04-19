import { useEffect, useState } from "react";
import axios from "axios";

const usePosts = (category = "") => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
          withCredentials: true
        });

        const allPosts = res.data;

        const filtered = category
          ? allPosts.filter((p) => p.category === category)
          : allPosts;

        setPosts(filtered);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  return { posts, loading, error };
};

export default usePosts;
