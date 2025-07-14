import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconProps,
} from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import "./SideMenu.scss";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Logo } from "../../lib/images";
import { logoutUser, showToast } from "../../lib/utils";
import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../lib/consts";
import SectionAnim from "../../assets/lottie/SectionAnim";
import DynamicLottie from "../../assets/lottie/DynamicLottie";

type MenuItemProp = {
  icon: React.ReactElement<SvgIconProps> | ReactNode;
  title: string;
  route: string | null;
  onClick?: () => void;
  children?: MenuItemProp[];
};

const SideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth > 768);
  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [expandMenuItem, setExpandMenuItem] = useState("");

  const mainMenu: MenuItemProp[] = [
    {
      title: "Dashboard",
      route: ROUTES.PENDING,
      icon: "pending",
    },
    // {
    //   title: "Approved",
    //   route: ROUTES.APPROVED,
    //   icon: "approved",
    // },
    // {
    //   title: "Rejected",
    //   route: ROUTES.REJECTED,
    //   icon: "rejected",
    // },
  ];

  return (
    <div
      className={`side-menu ${isExpanded ? "expanded" : ""}`}
      onMouseLeave={() => {
        if (window.innerWidth <= 768) {
          setIsExpanded(true);
        }
      }}
    >
      <div className="close-button">
        <button
          onClick={() => {
            if (window.innerWidth <= 768) {
              setIsExpanded(false);
            }
          }}
        >
          <CloseOutlinedIcon />
        </button>
      </div>
      <div className="head">
        {isExpanded ? (
          <img src={Logo} alt="Logo" className="logo" />
        ) : (
          <MenuOutlinedIcon
            fontSize="large"
            onClick={() => setIsExpanded(true)}
          />
        )}
      </div>
      <div className="content">
        {mainMenu.map((item) => (
          <ListItemButton
            className="menu-item"
            key={`main-menu-${item.title}`}
            selected={pathname === item.route}
            onClick={() => {
              if (item.children) {
                setExpandMenuItem(
                  expandMenuItem === item.title ? "" : item.title
                );
              } else {
                if (item.route) navigate(item.route);
              }
            }}
          >
            <ListItemIcon>
              <SectionAnim
                type={item.icon as "pending" | "approved" | "rejected"}
                shouldPlay={pathname === item.route}
                showLastFrame={pathname !== item.route}
              />
            </ListItemIcon>
            {isExpanded && (
              <ListItemText primary={item.title} sx={{ margin: 0 }} />
            )}
            {item.children && isExpanded ? (
              expandMenuItem === item.title ? (
                <ListItemIcon>
                  <ExpandLess />
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <ExpandMore />
                </ListItemIcon>
              )
            ) : (
              <></>
            )}
          </ListItemButton>
        ))}
      </div>
      <div className="footer">
        <ListItemButton
          onClick={() => {
            logoutUser();
            showToast("success", "You have been logged out successfully!");
          }}
        >
          <ListItemIcon>
            <DynamicLottie type="logout" shouldPlay />
          </ListItemIcon>
          {isExpanded && (
            <ListItemText
              primary="Logout"
              sx={{ margin: 0, marginLeft: "10px" }}
            />
          )}
        </ListItemButton>
      </div>
    </div>
  );
};

export default SideMenu;
