import React, { useState } from 'react';
import PostCard from '../PostCard';
import PostModal from '../PostModal'; // adjust import if needed

const ProfilePosts = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="mt-4 max-w-6xl mx-auto">
      {/* Scrollable Post Grid */}
      <div className="max-h-[350px] overflow-y-auto pr-1">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} onOpenModal={setSelectedPost} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">No posts yet.</p>
        )}
      </div>

      {/* Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ProfilePosts;
