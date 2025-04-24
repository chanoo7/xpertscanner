import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button, FormControl, FormHelperText, Grid, Link, InputAdornment,
  IconButton, InputLabel, OutlinedInput, Stack, Typography, Box
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import axios from 'axios';

export default function AuthRegister({ onUserAdded }) {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  const getAccessToken = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.accessToken || "";
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          role: '',
          type: '',
          allowedClient: '',
          firstName: '',
          lastName: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username (Email/Phone) is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').max(255).required('Password is required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
          role: Yup.string().required('Role is required'),
          type: Yup.string().required('Type is required'),
          allowedClient: Yup.string().max(255).required('Allowed Client is required'),
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
        })}
        onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
          try {
            const response = await axios.post(
              'http://localhost:5000/auth/register',
              values,
              {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
                withCredentials: true,
              }
            );
        
            if (response.status === 201) {
              onUserAdded({ type: "success", message: response.data.message || "User created successfully" });
              resetForm(); // Clear form fields on success
            } else {
              setErrors({ submit: 'Registration failed' });
              onUserAdded({ type: "error", message: "Registration failed" });
            }
          } catch (error) {
            console.error("Registration error:", error);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            setErrors({ submit: errorMsg });
            onUserAdded({ type: "error", message: errorMsg });
          }
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* First Name Field */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstName-signup">First Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                    id="firstName-signup"
                    type="text"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </Stack>
                {touched.firstName && errors.firstName && (
                  <FormHelperText error>{errors.firstName}</FormHelperText>
                )}
              </Grid>

              {/* Last Name Field */}
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastName-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                    id="lastName-signup"
                    type="text"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </Stack>
                {touched.lastName && errors.lastName && (
                  <FormHelperText error>{errors.lastName}</FormHelperText>
                )}
              </Grid>

              {/* Username Field */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="username-signup">Username (Email/Phone)*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                    id="username-signup"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email or phone"
                  />
                </Stack>
                {touched.username && errors.username && (
                  <FormHelperText error>{errors.username}</FormHelperText>
                )}
              </Grid>

              {/* Password Field */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
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
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              {/* Confirm Password Field */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirmPassword-signup">Confirm Password*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirmPassword-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.confirmPassword}
                    name="confirmPassword"
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
                    placeholder="Confirm password"
                  />
                </Stack>
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText error>{errors.confirmPassword}</FormHelperText>
                )}
              </Grid>

              {/* Role Field */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="role-signup">Role*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.role && errors.role)}
                    id="role-signup"
                    type="text"
                    value={values.role}
                    name="role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter role"
                  />
                </Stack>
                {touched.role && errors.role && (
                  <FormHelperText error>{errors.role}</FormHelperText>
                )}
              </Grid>

              {/* Type Field */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="type-signup">Type*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.type && errors.type)}
                    id="type-signup"
                    type="text"
                    value={values.type}
                    name="type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter type"
                  />
                </Stack>
                {touched.type && errors.type && (
                  <FormHelperText error>{errors.type}</FormHelperText>
                )}
              </Grid>

              {/* Allowed Client Field */}
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="allowedClient-signup">Allowed Client*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.allowedClient && errors.allowedClient)}
                    id="allowedClient-signup"
                    type="text"
                    value={values.allowedClient}
                    name="allowedClient"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter allowed client"
                  />
                </Stack>
                {touched.allowedClient && errors.allowedClient && (
                  <FormHelperText error>{errors.allowedClient}</FormHelperText>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
