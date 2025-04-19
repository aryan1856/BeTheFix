import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/PostCard.jsx";
import PostModal from "../components/PostModal.jsx";
import { Plus, Filter } from "lucide-react";
import usePosts from "../hooks/usePosts.jsx";

const HomePage = () => {
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const { posts, loading, error } = usePosts(selectedCategory);
  console.log(posts)

  const filteredPosts = selectedCategory
  ? posts.filter((post) => post.categories?.includes(selectedCategory))
  : posts;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[90%] max-w-6xl mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#2cb1bc] text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 shadow hover:bg-[#14919b] transition"
          >
            <Plus size={20} />
            Create New Post
          </motion.button>

          <div className="flex flex-wrap gap-2 items-center">
            <Filter size={20} className="text-gray-500" />
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-[#2cb1bc] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#2cb1bc] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} onOpenModal={setSelectedPost} />
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedPost && (
            <PostModal
              post={selectedPost}
              onClose={() => setSelectedPost(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
