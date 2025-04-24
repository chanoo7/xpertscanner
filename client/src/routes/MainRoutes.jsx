import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard'; // Renamed to avoid conflict with 'dashboard' route
import AdminRoute from 'components/AdminRoute'; // Protect admin routes

// Lazy-loaded pages
//const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/product-monitoring')));
const Login = Loadable(lazy(() => import('pages/authentication/login')));
const AdminDashboard = Loadable(lazy(() => import('pages/dashboard/Admin_index')));
const ViewDevices = Loadable(lazy(() => import('pages/devices/viewDevices')));
const AddDevice = Loadable(lazy(() => import('pages/devices/addDevice')));
const ViewReports = Loadable(lazy(() => import('pages/reports/viewReports')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />, // Use the renamed DashboardLayout component
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault /> // Corrected: Use DashboardDefault component
        },
        {
          path: 'admin',
          element: <AdminRoute element={<AdminDashboard />} /> // Admin route
        },
        {
          path: 'login', // Removed leading slash to avoid double slash in URL
          element: <Login /> // No need for AdminRoute here, login is accessible to all
        }
      ]
    },
    {
      path: 'devices',
      children: [
        {
          path: 'viewDevices',
          element: <ViewDevices />
        },
        {
          path: 'addDevice',
          element: <AddDevice />
        }
      ]
    },
    {
      path: 'reports',
      children: [
        {
          path: 'viewReports',
          element: <ViewReports />
        }
      ]
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;