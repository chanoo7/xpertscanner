import { DashboardOutlined, UserSwitchOutlined } from '@ant-design/icons';
import  FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
// icons
const icons = {
  DashboardOutlined,
  FormatLineSpacingIcon,
  QrCodeIcon,
  ViewModuleIcon 
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
    },
    {
      id: 'line-view', // Add LineView menu item
      title: 'Line View',
      type: 'item',
      url: '/line-view',
      icon: icons.FormatLineSpacingIcon,
      breadcrumbs: false,
      visible: userRole === 'su' || userRole === 'admin' || userRole === 'user' // Make LineView visible for all roles
    },
    {
      id: 'QRData', // Add LineView menu item
      title: 'QRData-view',
      type: 'item',
      url: '/qr-data-view',
      icon: icons.QrCodeIcon,
      breadcrumbs: false,
      visible: userRole === 'su' || userRole === 'admin' || userRole === 'user' // Make LineView visible for all roles
    },
    {
      id: 'LineLayout', // Add LineView menu item
      title: 'LineLayout-view',
      type: 'item',
      url: '/line-layout-view',
      icon: icons.ViewModuleIcon,
      breadcrumbs: false,
      visible: userRole === 'su' || userRole === 'admin' || userRole === 'user' // Make LineView visible for all roles
    }
  ]
};

export default dashboard;