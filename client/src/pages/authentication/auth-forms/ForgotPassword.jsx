import React, { useState } from 'react';
import {
  Button, TextField, Grid, Stack, Typography, CircularProgress, Alert
} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  
  // Step 1: Send OTP
  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestData = {};
      if (email) requestData.email = email;
      if (phone) requestData.phone = phone;

      if (!email && !phone) {
        setError("Please enter either Email or Phone Number.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, requestData);

      if (response.status === 200) {
        setOtpSent(true);
        Swal.fire('Success', 'An OTP has been sent to your registered contact.', 'success');
      } else {
        setError(response.data.message || 'Error sending OTP.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending OTP. Please enter valid details.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    setOtpLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        email: email || undefined,
        phone: phone || undefined,
        otp,
      });

      if (response.status === 200) {
        setOtpVerified(true);
        Swal.fire('Success', 'OTP Verified! Please enter a new password.', 'success');
      } else {
        setError(response.data.message || 'Invalid OTP.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error verifying OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleNewPasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setPasswordLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/resetPassword`, {
        email: email || undefined,
        phone: phone || undefined,
        newPassword,
      });

      if (response.status === 200) {
        Swal.fire('Success', 'Password reset successful! You can now log in.', 'success')
          .then(() => window.location.href = '/login'); // Redirect to login
      } else {
        setError(response.data.message || 'Error resetting password.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error resetting password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Stack spacing={2} sx={{ p: 4, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="h5" align="center" gutterBottom>Forgot Password</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          {!otpSent ? (
            <>
              <TextField
                label="Email (optional)"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                type="email"
              />
              <TextField
                label="Phone Number (optional)"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                margin="normal"
                type="tel"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleResetPassword}
                disabled={loading || (!email && !phone)}
              >
                {loading ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            </>
          ) : !otpVerified ? (
            <>
              <TextField
                label="OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                type="number"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleVerifyOTP}
                disabled={otpLoading || !otp}
              >
                {otpLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
            </>
          ) : (
            <>
              <TextField
                label="New Password"
                fullWidth
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
              />
              <TextField
                label="Confirm Password"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleNewPasswordSubmit}
                disabled={passwordLoading || !newPassword || !confirmPassword}
              >
                {passwordLoading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
