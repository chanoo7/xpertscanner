import { lazy } from 'react';
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AdminRoute from 'components/AdminRoute';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/product-monitoring')));
const LineView = Loadable(lazy(() => import('pages/dashboard/LineView')));
const QrDataView = Loadable(lazy(() => import('pages/dashboard/QrDataView')));
const ReadMasterData = Loadable(lazy(() => import('pages/dashboard/ReadMasterData')));
const CreateLBR = Loadable(lazy(() => import('pages/dashboard/createLBR')));
const ViewLBR = Loadable(lazy(() => import('pages/dashboard/viewLBR')));
const ProductionData = Loadable(lazy(() => import('pages/dashboard/productionData')));
const CompactIdLayout = Loadable(lazy(() => import('pages/dashboard/CompactIdLayout')));
const Login = Loadable(lazy(() => import('pages/authentication/login')));
const AdminDashboard = Loadable(lazy(() => import('pages/dashboard/Admin_index')));
const ViewDevices = Loadable(lazy(() => import('pages/devices/viewDevices')));
const AddDevice = Loadable(lazy(() => import('pages/devices/addDevice')));
const ViewReports = Loadable(lazy(() => import('pages/reports/viewReports')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
        {
          path: 'admin',
          element: <AdminRoute element={<AdminDashboard />} />
        },
        {
          path: 'login',
          element: <Login />
        }
      ]
    },
    {
      path: 'line-view', // Add LineView Route
      element: <LineView />
    },
    {
      path: 'qr-data-view', // Add LineView Route
      element: <QrDataView />
    },
    {
      path: 'read-master-data',
      element: <ReadMasterData />
    },
    {
      path: 'create-LBR',
      element: <CreateLBR />
    },
    {
      path: 'view-LBR',
      element: <ViewLBR />
    },
    {
      path: 'productionData',
      element: <ProductionData />
    },
    {
      path: 'line-layout-view', // Add LineView Route
      element: <CompactIdLayout />
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