import React from "react";
import "./UserCard.scss";

type UserCardProps = {
  image: string;
  title: string;
  count: number;
};
const UserCard: React.FC<UserCardProps> = ({ count, image, title }) => {
  return (
    <div className="user-card">
      <img src={image} alt={title} />
      <p className="user-card-title">{title}</p>
      <p className="user-card-count">{count}</p>
      {/* <div className="container"></div> */}
    </div>
  );
};

export default UserCard;
