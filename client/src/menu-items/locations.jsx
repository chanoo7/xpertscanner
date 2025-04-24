// assets
import { ProfileOutlined, GlobalOutlined, BarsOutlined } from '@ant-design/icons';

// icons
const icons = {
  ProfileOutlined,
  GlobalOutlined,
  BarsOutlined,
  

};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'location',
  title: 'Locations',
  type: 'group',
  children: [
    {
      id: 'viewMap',
      title: 'View in Map',
      type: 'item',
      url: '/locations/viewMap',
      icon: icons.GlobalOutlined,
      target: false
    },
    {
      id: 'showLocations',
      title: 'View All Locations',
      type: 'item',
      url: '/locations/viewLocations',
      icon: icons.BarsOutlined,
      target: false
    },
    {
      id: 'addLocations',
      title: 'Add a New Location',
      type: 'item',
      url: '/locations/addLocation',
      icon: icons.ProfileOutlined,
      target: false
    },
    {
      id: 'reviewLocations',
      title: 'review Location',
      type: 'item',
      url: '/locations/addLocation',
      icon: icons.ProfileOutlined,
      target: false
    }
  ]
};

export default pages;
