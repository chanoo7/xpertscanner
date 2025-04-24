import { DashboardOutlined, UserSwitchOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserSwitchOutlined // Icon for Admin Dashboard
};

// Function to safely get user role from localStorage
const getUserRole = () => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) return null; // Return null if no user data exists
    const parsedData = JSON.parse(userData);
    return parsedData?.role || null; // Ensure role is returned properly
  } catch (error) {
    console.error("Error parsing userData:", error);
    return null;
  }
};

const userRole = getUserRole();


// ==============================|| MENU ITEMS - DASHBOARD ||============================== //
const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: (() => { // Use an IIFE to determine the URL dynamically
        if (userRole === 'su' || userRole === 'admin') {
          return '/dashboard/admin';
        } else if (userRole == 'user') { 
          return '/dashboard/default';
        } else {
          return '/login'; // Redirect to /login if userRole is null or undefined
        }
      })(),
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;