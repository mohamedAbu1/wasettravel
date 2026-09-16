"use client";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FaUserPlus } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useState } from "react";

export default function MobileHeaderAuth() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { userData, logout } = useAuth();
  const { handleLoginOpen } = useData();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!isMobile) return null;

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

 
  return (
    <div>
      {!userData ? (
        <IconButton onClick={handleLoginOpen} aria-label="Sign in" title="Sign in" style={{ borderRadius: "15px" }}>
          <FaUserPlus size={22} />
        </IconButton>
      ) : (
        <>
          <IconButton onClick={handleOpenMenu} aria-label="Open account menu" title="Open account menu">
            <Avatar
              src={userData?.avatar_url || userData?.image || "/default-avatar.png"}
              alt={userData?.name}
            />
          </IconButton>

          {/* ✅ Popup menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={async () => { await logout(); handleCloseMenu(); }}>Logout</MenuItem>
          </Menu>
        </>
      )}
    </div>
  );
}
