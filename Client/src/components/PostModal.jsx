import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux';

const PostModal = ({ post, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const loggedInUser = useSelector((store) => store.user.loggedinUser);
  console.log(loggedInUser)

  useEffect(() => {
    const fetchDetailedComments = async () => {
      try {
        if (!post.comments?.length) {
          setIsLoading(false);
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/comments/getcomments/${post._id}`,
          {},
          { withCredentials: true }
        );

        setComments(res.data.comments);
      } catch (err) {
        setErrorMsg('Failed to load comments');
        toast.error('Failed to load comments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailedComments();
  }, [post]);


  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/comments/add`,
        {
          postId: post._id,
          text: newComment,
        },
        {
          withCredentials: true,
        }
      );

      const newAddedComment = {
        _id: res.data.comment._id,
        text: res.data.comment.text,
        fullName: loggedInUser.fullName,
        avatar: loggedInUser.avatar,
        replies: [],
      };
      console.log(newAddedComment)
      setComments((prev) => [...prev, newAddedComment]);
      setNewComment('');
    } catch (err) {
      toast.error(err.message);
      console.error('Failed to add comment:', err);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 z-50 transition-all duration-300"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row h-full">
          {/* Left (Image) */}
          <div className="sm:w-1/2 w-full relative h-[250px] sm:h-auto">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-10 bg-black/50 p-1 rounded-full text-white hover:bg-black/75"
            >
              <X size={20} />
            </button>

            <div className="relative h-full">
              <img
                src={post.images?.[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain rounded-l-2xl"
              />
              {post.images.length > 1 && (
                <>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1}/{post.images.length}
                  </div>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="sm:w-1/2 w-full flex flex-col h-[60vh] sm:h-[90vh]">
            <div className="p-4 sm:p-6 border-b max-h-90 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{post.author.name}</h3>
                  <p className="text-sm text-gray-500">{post.location?.address}</p>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{post.caption}</p>
            </div>

            {/*  Comments Section */}

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100%-160px)]">

              {isLoading ? (
                <p className="text-center text-gray-500">Loading comments...</p>
              ) : errorMsg ? (
                <p className="text-center text-red-500">{errorMsg}</p>
              ) : comments.length === 0 ? (
                <p className="text-center text-gray-400">No comments yet.</p>
              ) : (
                comments.map((comment, idx) => (
                  <div key={comment._id} className="mb-6">
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.avatar}
                        alt={comment.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="bg-white/60 backdrop-blur-md shadow-sm border border-gray-200 rounded-lg p-3 transition-all duration-200">
                          <h4 className="font-medium">{comment.fullName}</h4>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>

                        {/* Replies toggle */}
                        <button
                          onClick={async () => {
                            const updated = [...comments];
                            const target = updated[idx];

                            if (!target.showReplies) {
                              try {
                                const res = await axios.get(
                                  `${import.meta.env.VITE_BACKEND_URL}/api/comments/replies/${comment._id}`,
                                  { withCredentials: true }
                                );
                                target.replies = res.data.replies;
                              } catch (err) {
                                toast.error('Failed to load replies');
                              }
                            }

                            target.showReplies = !target.showReplies;
                            setComments(updated);
                          }}
                          className="text-sm text-blue-500 mt-1 hover:underline cursor-pointer"
                        >
                          {comment.showReplies ? 'Hide Replies' : 'View Replies'}
                        </button>

                        {/* Replies list */}
                        {comment.showReplies &&
                          comment.replies?.map((reply) => (
                            <div key={reply._id} className="flex items-start gap-2 ml-8 mt-2">
                              <img
                                src={reply.avatar}
                                alt={reply.fullName}
                                className="w-6 h-6 rounded-full"
                              />
                              <div className="bg-gray-100/70 border border-gray-200 rounded-lg px-3 py-2 w-full text-sm shadow-sm">
                                <h5 className="font-medium text-sm">{reply.fullName}</h5>
                                <p className="text-sm text-gray-700">{reply.text}</p>
                              </div>
                            </div>
                          ))}

                        {/* Add Reply input */}
                        {comment.showReplies && (
                          <div className="ml-8 mt-2 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add a reply..."
                              value={comment.replyText || ''}
                              onChange={(e) => {
                                const updated = [...comments];
                                updated[idx].replyText = e.target.value;
                                setComments(updated);
                              }}
                              className="flex-1 border border-gray-300 focus:ring-2 focus:ring-blue-400 px-4 py-2 rounded-full text-sm shadow-sm transition duration-200"
                            />
                            <button
                              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full cursor-pointer"
                              onClick={async () => {
                                const text = comment.replyText?.trim();
                                if (!text) return;
                                try {
                                  const res = await axios.post(
                                    `${import.meta.env.VITE_BACKEND_URL}/api/comments/add`,
                                    {
                                      parent: comment._id,
                                      text,
                                      postId: post._id
                                    },
                                    { withCredentials: true }
                                  );


                                  const newReply = {
                                    _id: res.data.comment._id,
                                    text: res.data.comment.text,
                                    fullName: loggedInUser.fullName,
                                    avatar: loggedInUser.avatar,
                                  };

                                  const updated = [...comments];
                                  updated[idx].replies = [...(updated[idx].replies || []), newReply];
                                  updated[idx].replyText = '';
                                  setComments(updated);
                                } catch (err) {
                                  toast.error('Failed to add reply');
                                  console.error(err);
                                }
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* ✍️ Comment Input */}
            <div className="p-3 sm:p-4 border-t">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 cursor-pointer"
                  onClick={handleAddComment}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostModal;
