import React from "react";
import ProfilePosts from "./ProfilePosts";
import ProfileAbout from "./ProfileAbout";
import ProfileBadges from "./ProfileBadges";
import ProfileVolunteeredPosts from "./ProfileVolunteeredPosts";

const ProfileTabContent = ({ activeTab, posts , LoggedInUser}) => {
  if (activeTab === "Posts") {
    return <ProfilePosts posts={posts}/>
  }

  if (activeTab === "About") {
    return <ProfileAbout LoggedInUser={LoggedInUser}/>
  }

  if (activeTab === "Badges") {
      return <ProfileBadges/>
  }

  if(activeTab==="Volunteered Posts"){
    return <ProfileVolunteeredPosts/>
  }

  return null;
};

export default ProfileTabContent;
