import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';  // Import axios for API requests

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import EditOutlined from '@ant-design/icons/EditOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import WalletOutlined from '@ant-design/icons/WalletOutlined';

export default function ProfileTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);		
  const navigate = useNavigate();

  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

const handleLogout = async () => {

const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData) return;

  const accessToken  = userData.accessToken; // Only accessToken is needed from localStorage
  //console.log(accessToken)
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/logout`,
      {}, // No need for refreshToken in body since it's in the cookie
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }, // Bearer token in headers
        withCredentials: true, // Send cookies with the request
      }
    );
    localStorage.removeItem("userData"); // Clear localStorage
    navigate("/login");
    console.log("Logout successful:", response.data);
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
  }
    
  };
  
  

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/apps/profiles/user/personal')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1, '/apps/profiles/account/basic')}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
