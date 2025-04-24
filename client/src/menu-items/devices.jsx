// assets
import { BarsOutlined, SisternodeOutlined } from '@ant-design/icons';

// icons
const icons = {
SisternodeOutlined,
  BarsOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'devices',
  title: 'Devices',
  type: 'group',
  children: [
    {
      id: 'showDevices',
      title: 'Show Devices',
      type: 'item',
      url: '/devices/viewDevices',
      icon: icons.BarsOutlined,
      target: false
    },
    {
      id: 'registerDevice',
      title: 'Register a New Device',
      type: 'item',
      url: '/devices/addDevice',
      icon: icons.SisternodeOutlined,
      target: false
    }
  ]
};

export default pages;
