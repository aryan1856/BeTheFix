import React, { useState, useEffect } from "react";
import axios from 'axios';
import {useSelector} from 'react-redux';
import toast from 'react-hot-toast';
import UserProfile from '../components/ProfileMainComponent.jsx'
import ProfileTabContent from "../components/profile_components/ProfileTabContent";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("Posts");
    const LoggedInUser = useSelector((state) => state.user);
    const [posts, setPosts] = useState([]);
    const [resolvedCount, setResolvedCount] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/u`, {
                    withCredentials : true
                });
                console.log(response);
                if (!response.data.success) {
                  throw new Error(`Error: ${response.status}`);
                }
                
                setPosts(response.data.posts);
                setResolvedCount(response.data.resolvedCount);
            } catch (err) {
                // console.error("Error fetching posts:", err);
                toast.error("Error fetching posts")
            }
        }
        fetchPosts();
    }, []);


    return (
        <div className="p-4">
            <UserProfile activeTab={activeTab} setActiveTab={setActiveTab} LoggedInUser={LoggedInUser}/>
            <ProfileTabContent activeTab={activeTab} posts={posts} LoggedInUser={LoggedInUser} resolvedCount={resolvedCount}/>
        </div>
    );
};

export default Profile;