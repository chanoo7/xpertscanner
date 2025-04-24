import { Navigate } from 'react-router-dom';

// Get user role from local storage
const getUserRole = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  return userData?.role; // Returns "su" for super admin
};

// Role-based Admin Route Protection
export default function AdminRoute({ element }) {
  const role = getUserRole();

  return role === 'su' || role ==='admin' ? element : <Navigate to="/dashboard/default" replace />;
}
