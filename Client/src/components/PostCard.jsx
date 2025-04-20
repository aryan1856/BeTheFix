import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageCircle, MapPin } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PostCard = ({ post, onOpenModal }) => {
  const [upvoted, setUpvoted] = useState(post.upvoted);
  const [downvoted, setDownvoted] = useState(post.downvoted);
  const [upvotes, setUpvotes] = useState(post.upvotes.length);
  const [downvotes, setDownvotes] = useState(post.downvotes.length);
  const [isVolunteered, setIsVolunteered] = useState(post.alreadyVolunteered || false);

  const location = useSelector((state) => state.location);

  const handleVote = async (type) => {
    try {
      const upOrDown = type === 'upvote' ? 'upvote' : 'downvote';

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/u/${upOrDown}/${post._id}`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          withCredentials: true,
        }
      );

      if (type === 'upvote') {
        if (upvoted) {
          setUpvoted(false);
          setUpvotes(upvotes - 1);
        } else {
          setUpvoted(true);
          setUpvotes(upvotes + 1);
          if (downvoted) {
            setDownvoted(false);
            setDownvotes(downvotes - 1);
          }
        }
      } else {
        if (downvoted) {
          setDownvoted(false);
          setDownvotes(downvotes - 1);
        } else {
          setDownvoted(true);
          setDownvotes(downvotes + 1);
          if (upvoted) {
            setUpvoted(false);
            setUpvotes(upvotes - 1);
          }
        }
      }

    } catch (error) {
      if (!error.response?.data) toast.error(error.message);
      else toast.error(error.response.data.message);
      console.error(`Error while ${type}:`, error);
    }
  };

  const handleVolunteer = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/volunteerpost/${post._id}`, {},
        { withCredentials: true }
      );
      toast.success("You are now a volunteer, go and fix this issue.");
      setIsVolunteered(true);
    } catch (error) {
      if (!error.response?.data) toast.error(error.message);
      else toast.error(error.response.data.message);
      console.error("Volunteer error:", error);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Forwarded: 'bg-blue-100 text-blue-800',
    Resolved: 'bg-green-100 text-green-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={post.images?.[0]}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        {post.images?.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            +{post.images.length - 1}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={post.author?.avatar}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-medium truncate">{post.author?.name}</h3>
              <div className="flex items-center text-sm text-gray-500 truncate">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">
                  {post.location?.area + "," + post.location?.city + "," + post.location?.country || "Unknown"}
                </span>
              </div>
            </div>
          </div>
          {post.status?.state && (
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[post.status.state] || 'bg-gray-200 text-gray-800'}`}>
              {post.status.state}
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">{post.caption}</p>

        {/* Buttons */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-4">
            <button
              onClick={() => handleVote('upvote')}
              className={`flex items-center gap-1 ${upvoted ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600 cursor-pointer`}
            >
              <ThumbsUp size={18} fill={upvoted ? 'currentColor' : 'none'} />
              {upvotes}
            </button>

            <button
              onClick={() => handleVote('downvote')}
              className={`flex items-center gap-1 ${downvoted ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 cursor-pointer`}
            >
              <ThumbsDown size={18} fill={downvoted ? 'currentColor' : 'none'} />
              {downvotes}
            </button>
          </div>

          <button
            onClick={() => onOpenModal(post)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer transition-colors"
          >
            <MessageCircle size={18} />
            {post.comments?.length || 0} comments
          </button>
        </div>

        {/* Volunteer Button */}
        {post.status?.state !== 'Resolved' && (
          <button
            onClick={handleVolunteer}
            disabled={isVolunteered}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isVolunteered ? 'Already Volunteered' : 'Volunteer'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;
