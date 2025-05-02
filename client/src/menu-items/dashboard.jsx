import { DashboardOutlined } from '@ant-design/icons';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

// Icons
const icons = {
  DashboardOutlined,
  FormatLineSpacingIcon,
  QrCodeIcon,
  ViewModuleIcon
};

// Get role from localStorage
const getUserRole = () => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) return null;
    const parsedData = JSON.parse(userData);
    return parsedData?.role || null;
  } catch (error) {
    console.error("Error parsing userData:", error);
    return null;
  }
};

const userRole = getUserRole();
const isVisibleToAll = ['su', 'admin', 'user'].includes(userRole);

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: (() => {
        if (userRole === 'su' || userRole === 'admin') return '/dashboard/admin';
        if (userRole === 'user') return '/dashboard/default';
        return '/login';
      })(),
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'line-view',
      title: 'Line View',
      type: 'item',
      url: '/line-view',
      icon: icons.FormatLineSpacingIcon,
      breadcrumbs: false,
      visible: isVisibleToAll
    },
    {
      id: 'QRData',
      title: 'QRData-view',
      type: 'item',
      url: '/qr-data-view',
      icon: icons.QrCodeIcon,
      breadcrumbs: false,
      visible: isVisibleToAll
    },
    {
      id: 'read-master-data',
      title: 'read-master-data',
      type: 'item',
      url: '/read-master-data',
      icon: icons.QrCodeIcon,
      breadcrumbs: false,
      visible: isVisibleToAll
    },
    {
      id: 'create-LBR',
      title: 'create-LBR',
      type: 'item',
      url: '/create-LBR',
      icon: icons.QrCodeIcon,
      breadcrumbs: false,
      visible: isVisibleToAll
    },{
      id: 'view-LBR',
      title: 'view-LBR',
      type: 'item',
      url: '/view-LBR',
      icon: icons.QrCodeIcon,
      breadcrumbs: false,
      visible: isVisibleToAll
    },
    {
      id: 'LineLayout',
      title: 'LineLayout-view',
      type: 'item',
      url: '/line-layout-view',
      icon: icons.ViewModuleIcon,
      breadcrumbs: false,
      visible: isVisibleToAll
    }
  ]
};

export default dashboard;
