import React from "react";
import ProfilePosts from "./ProfilePosts";
import ProfileAbout from "./ProfileAbout";
import ProfileBadges from "./ProfileBadges";
import ProfileVolunteeredPosts from "./ProfileVolunteeredPosts";

const ProfileTabContent = ({ activeTab, posts , LoggedInUser, resolvedCount}) => {

  // console.log(posts);

  const userData = {
    name: LoggedInUser.loggedinUser.fullName,
    badges: resolvedCount % 5,
    issuesResolved: resolvedCount,
    megaBadge: resolvedCount >= 25,
    volunteerBadge : LoggedInUser.loggedinUser.volunteeredAndResolved > 0,
    volunteerResolvedCount : LoggedInUser.loggedinUser.volunteeredAndResolved
  };

  if (activeTab === "Posts") {
    return <ProfilePosts posts={posts}/>
  }

  if (activeTab === "About") {
    return <ProfileAbout LoggedInUser={LoggedInUser}/>
  }

  if (activeTab === "Badges") {
      return <ProfileBadges user={userData}/>
  }

  if(activeTab==="Volunteered Posts"){
    return <ProfileVolunteeredPosts/>
  }

  return null;
};

export default ProfileTabContent;
