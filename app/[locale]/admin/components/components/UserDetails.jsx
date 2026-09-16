import React from "react";
import UserLikes from "./UserLikes";
import UserComments from "./UserComments";

const UserDetails = ({ user, activeTab }) => {
  return (
    <div className="admin-user-details">
      {activeTab === "likes" && <UserLikes user={user} />}
      {activeTab === "comments" && <UserComments user={user} />}
    </div>
  );
};

export default UserDetails;
