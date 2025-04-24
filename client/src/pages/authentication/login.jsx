import React from 'react';
import { Link } from 'react-router-dom';

// Project imports
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

export default function Login() {
  const handleLoginSuccess = () => {
    
  };

  return (
    <AuthWrapper>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="text-center mb-4">
              {/* <h3>Login</h3> */}
              {/* Uncomment if registration link is needed */}
              {/* <p>
                <Link to="/register" className="text-primary text-decoration-none">
                  Don't have an account?
                </Link>
              </p> */}
            </div>
            <div>
              {/* AuthLogin component should handle login logic and invoke `handleLoginSuccess` on success */}
              <AuthLogin />
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
