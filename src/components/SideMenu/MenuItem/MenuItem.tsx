import { Icon, SvgIconProps } from "@mui/material";
import "./MenuItem.scss";
import React from "react";

type MenuItemProps = {
  icon: React.ReactElement<SvgIconProps>;
  title: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick?: () => void;
};
const MenuItem1 = ({
  icon,
  title,
  isActive,
  isExpanded,
  onClick,
}: MenuItemProps) => {
  return (
    <div className={`menu-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <Icon className="icon">{icon}</Icon>
      <div className={`title-wrapper ${isExpanded ? "expanded" : ""}`}>
        {isExpanded && <p className="title">{title}</p>}
      </div>
    </div>
  );
};

export default MenuItem1;
