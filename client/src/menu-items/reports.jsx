// assets
import {  FilePdfOutlined } from '@ant-design/icons';

// icons
const icons = {
FilePdfOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'reports',
  title: 'Reports',
  type: 'group',
  children: [
    {
      id: 'showReports',
      title: 'View All Reports',
      type: 'item',
      url: '/reports/viewReports',
      icon: icons.FilePdfOutlined,
      target: false
    }
  ]
};

export default pages;
