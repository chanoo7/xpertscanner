import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button, Checkbox, FormControlLabel, FormHelperText, Grid, Link, InputAdornment,
  IconButton, InputLabel, OutlinedInput, Stack, Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import axios from 'axios';  // Import axios for API calls
import Swal from "sweetalert2";
import ForgotPassword from './forgotPassword';
console.log("Environment Variables:", import.meta.env);
export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  //console.log(`${process.env.REACT_APP_API_URL}`)
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleForgotPassword = () => {
    console.log("Forgot Password Clicked!");
    
    // Add your logic here (e.g., open a modal, show a form, etc.)
  };

  return (
    <Formik
      initialValues={{
        username: "", // Can be email or phone
        password: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        // username: Yup.string()
        //   .matches(
        //     /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\d{10}$/,
        //     "Enter a valid email or phone number"
        //   )
        //   .required("Email or Phone is required"),
          username: Yup.string().required("Email or Phone is required"),

        password: Yup.string().max(255).required("Password is required"),
      })}

  
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            {
              username: values.username,
              password: values.password,
            },
            { withCredentials: true }
          );

          if (response.status === 200) {
            // Store user data
            localStorage.setItem("userData", JSON.stringify(response.data));

            // Success Alert
            Swal.fire({
              icon: "success",
              title: "Login Successful",
              text: "Welcome back!",
              confirmButtonText: "OK",
            }).then(() => {
             
              if (response.data.role === "user") {
                //console.log(response.data.role)
                navigate("/dashboard/default");
                
              } else { 
                //console.log("else"+response.data.role)
                navigate('/dashboard/admin');
              }
            });
          } else {
            setErrors({ submit: "Invalid credentials" });
          }
        } catch (error) {
          console.error("Login error:", error.response?.data || error.message);
          
          // Error Alert
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: error.response?.data?.message || "Invalid credentials",
            confirmButtonText: "Try Again",
          });
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="username">Email or Phone Number</InputLabel>
                <OutlinedInput
                  id="username"
                  type="text"
                  value={values.username}
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email or phone number"
                  fullWidth
                  error={Boolean(touched.username && errors.username)}
                />
              </Stack>
              {touched.username && errors.username && (
                <FormHelperText error>{errors.username}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
              </Stack>
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <FormControlLabel
                  control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} size="small" />}
                  label={<Typography variant="h6">Keep me signed in</Typography>}
                />
                <Link
                  component={RouterLink}
                  to="/forgotPassword" // Corrected to lowercase 'f'
                  variant="h6"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", textDecoration: 'none' }}
                >
                  Forgot Password?
                </Link>
              </Stack>
            </Grid>

            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}

            <Grid item xs={12}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
