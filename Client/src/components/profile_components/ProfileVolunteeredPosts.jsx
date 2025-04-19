import React, { useEffect, useState } from 'react';
import PostCard from '../PostCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import PostModal from '../PostModal';

const ProfileVolunteeredPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/getuservolunteeredposts`,
                    {
                        withCredentials: true,
                    }
                );
                if (!response.data.success) throw new Error(`Error: ${response.status}`);
                setPosts(response.data.postsWithDetails || []);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const openModal = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!selectedPost || !remarks || !image) {
            alert('Please fill all fields.');
            return;
        }

        const formData = new FormData();
        formData.append('postId', selectedPost._id);
        formData.append('remarks', remarks);
        formData.append('image', image);

        const toastId = toast.loading('Resolving post...');

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/volunteerandresolvepost`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success('Post resolved successfully!', { id: toastId });

                // Update the post's status in state
                setPosts((prev) =>
                    prev.map((p) =>
                        p._id === selectedPost._id
                            ? {
                                ...p,
                                status: {
                                    ...p.status,
                                    state: 'Resolved',
                                    remarks: remarks,
                                },
                            }
                            : p
                    )
                );
            } else {
                toast.error(`Error: ${response.data.message}`, { id: toastId });
            }
        } catch (error) {
            toast.error('Something went wrong while submitting.', { id: toastId });
            console.error('Error submitting resolution:', error);
        } finally {
            setShowModal(false);
            setRemarks('');
            setImage(null);
        }
    };



    return (
        <div className="mt-4 max-w-6xl mx-auto">
            <div className="max-h-[350px] overflow-y-auto pr-1">
                {loading ? (
                    <p className="text-center text-gray-400 text-sm">Loading...</p>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="border rounded-lg p-3 shadow-md bg-white flex flex-col justify-between"
                            >
                                <PostCard post={post} onOpenModal={setSelectedPost}/>
                                {post.status?.state !== 'Resolved' && (
                                    <button
                                        className="mt-3 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                        onClick={() => openModal(post)}
                                    >
                                        Resolve
                                    </button>
                                )}

                            </div>
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-11/12 max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Resolve Post</h2>

                        <label className="block mb-2 text-sm font-medium">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mb-4 w-full"
                        />

                        <label className="block mb-2 text-sm font-medium">Remarks</label>
                        <textarea
                            rows="4"
                            className="w-full p-2 border rounded mb-4"
                            placeholder="Enter your remarks..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileVolunteeredPosts;
