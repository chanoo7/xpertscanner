import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { } from "@mui/material";
import { Edit, LockReset, CheckCircle, Cancel } from "@mui/icons-material";
import Swal from "sweetalert2";


import { FmdGood } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
  TableSortLabel,
  TextField,
  Box,
  Snackbar,
  Alert,
  Avatar,
  Typography,
  IconButton,

} from "@mui/material";
import axios from "axios";
import AuthRegister from "../authentication/auth-forms/AuthRegister";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [loginDuration, setLoginDuration] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoginDurations, setUserLoginDurations] = useState({});


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    checkUserLoginStatus();
  }, [users]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };


  const handleSaveUser = async () => {
    try {     
      const updatedUser = {
        ...selectedUser,
        contact: {
          ...selectedUser.contact,
          userId: selectedUser.userId, // Use userId as contactId
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/updateUser`,
        updatedUser, // Send updated user with userId as contactId
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", "User updated successfully!", "success");
        setEditOpen(false);
        fetchUsers(); // Refresh user list
      } else {
        Swal.fire("Error", "Failed to update user.", "error");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };



  const checkUserLoginStatus = () => {
    const updatedDurations = {};

    users.forEach((user) => {
      const lastLoginTime = user.lastLoggedInTime ? new Date(user.lastLoggedInTime).getTime() : null;

      if (user.isLoggedin && lastLoginTime) {
        // If the user is logged in, calculate the duration from last login time
        updatedDurations[user.id] = calculateLoginDuration(lastLoginTime);
      } else if (!user.isLoggedin && lastLoginTime) {
        // If the user is offline, calculate the time since their last login
        updatedDurations[user.id] = ` ${calculateLoginDuration(lastLoginTime)}`;
      } else {
        // If no login time is available, show a default message
        updatedDurations[user.id] = 'No login data';
      }
    });

    // Update the state with calculated durations
    setUserLoginDurations(updatedDurations);
  };

  const calculateLoginDuration = (loginTime) => {
    const now = Date.now();
    const durationMs = now - loginTime;
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };


  const getAccessToken = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.accessToken || "";
  };

  const handleOpen = () => {
    setOpen(true);
    fetchUsers();
  };

  const handleClose = () => setOpen(false);

  const handleUserAdded = ({ type, message }) => {
    setAlertMessage({ type, message });
    fetchUsers();
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/listUsers`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
          withCredentials: true,
        }
      );

      //console.log(response.data); // Check what the actual response looks like

      // Assuming response.data contains a users array
      setUsers(response.data.users || []);  // Set an empty array if users are not in the response

    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      setUsers([]); // Ensure users is always an array
    }
  };


  const handleToggleUserStatus = async (user) => {
    const isEnabling = !user.isActive; // Determine if enabling or disabling
    const apiUrl = isEnabling
      ? `${import.meta.env.VITE_API_URL}/auth/enableUser`
      : `${import.meta.env.VITE_API_URL}/auth/disableUser`;

    try {
      const response = await axios.post(
        apiUrl,
        { username: user.username },
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // ✅ Update local state immediately
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.username === user.username ? { ...u, isActive: isEnabling } : u
          )
        );

        // ✅ Show SweetAlert2 for success
        Swal.fire({
          title: isEnabling ? "User Enabled" : "User Disabled",
          text: `User ${user.username} has been ${isEnabling ? "enabled" : "disabled"}.`,
          icon: isEnabling ? "success" : "error",
          confirmButtonColor: isEnabling ? "#3085d6" : "#d33",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: `Failed to update user ${user.username}.`,
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to update user ${user.username}.`,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };



  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <h2 style={{ marginBottom: "15px" }}>Admin Dashboard</h2>
      <Button variant="contained" style={{ marginBottom: "15px" }} startIcon={<AddIcon />} onClick={handleOpen}>
        Add User
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle style={{ marginBottom: "25px" }}>Add User</DialogTitle>
        <DialogContent>
          {alertMessage && (
            <Snackbar
              open={!!alertMessage}
              autoHideDuration={1000}
              onClose={() => setAlertMessage(null)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={alertMessage.type || "info"}>{alertMessage.message}</Alert>
            </Snackbar>
          )}

          <AuthRegister onUserAdded={handleUserAdded} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <form>
              <TextField
                fullWidth
                label="Username"
                value={selectedUser.username}
                onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Legal Name"
                value={selectedUser.contact?.legalName || ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: { ...selectedUser.contact, legalName: e.target.value }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Assigned Employer"
                value={selectedUser.contact?.assignedEmployer || ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: { ...selectedUser.contact, assignedEmployer: e.target.value }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Assigned Sites"
                value={selectedUser.contact?.assignedSites ? JSON.parse(selectedUser.contact.assignedSites).city : ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: {
                    ...selectedUser.contact,
                    assignedSites: JSON.stringify({ city: e.target.value }) // Convert back to string
                  }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Designation"
                value={selectedUser.contact?.designation || ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: { ...selectedUser.contact, designation: e.target.value }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Position"
                value={selectedUser.contact?.employmentInfo ? JSON.parse(selectedUser.contact.employmentInfo).position : ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: {
                    ...selectedUser.contact,
                    employmentInfo: JSON.stringify({
                      position: e.target.value,
                      salary: JSON.parse(selectedUser.contact.employmentInfo).salary || 0
                    })
                  }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={selectedUser.contact?.employmentInfo
                  ? JSON.parse(selectedUser.contact.employmentInfo).salary || ""
                  : ""}
                onChange={(e) => {
                  const salary = e.target.value ? Number(e.target.value) : 0; // Convert input to number
                  const employmentInfo = selectedUser.contact?.employmentInfo
                    ? JSON.parse(selectedUser.contact.employmentInfo)
                    : { position: "" };

                  setSelectedUser({
                    ...selectedUser,
                    contact: {
                      ...selectedUser.contact,
                      employmentInfo: JSON.stringify({ ...employmentInfo, salary }),
                    },
                  });
                }}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Banking Info"
                value={selectedUser.contact?.bankingInfo || ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: { ...selectedUser.contact, bankingInfo: e.target.value }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Personal Info"
                value={selectedUser.contact?.personalInfo || ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: { ...selectedUser.contact, personalInfo: e.target.value }
                })}
                margin="dense"
              />

              <TextField
                fullWidth
                label="Misc Info"
                value={selectedUser.contact?.miscInfo || ""}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  contact: { ...selectedUser.contact, miscInfo: e.target.value }
                })}
                margin="dense"
              />

              {/* Add more fields as needed */}
            </form>

          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ border: "2px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              {["id", "username", "legalName", "Loggeedin", "Activity", "user Status"].map((column) => (
                <TableCell key={column} sx={{ color: "white", fontWeight: "bold" }}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? orderDirection : "asc"}
                    onClick={() => {
                      const isAsc = orderBy === column && orderDirection === "asc";
                      setOrderBy(column);
                      setOrderDirection(isAsc ? "desc" : "asc");
                    }}
                    sx={{ color: "white" }}
                  >
                    {column.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...users]
              .sort((a, b) => {
                if (orderBy === "id") {
                  return orderDirection === "asc" ? a.id - b.id : b.id - a.id;
                }
                if (orderBy === "username") {
                  return orderDirection === "asc"
                    ? a.username.localeCompare(b.username)
                    : b.username.localeCompare(a.username);
                }
                if (orderBy === "legalName") {
                  return orderDirection === "asc"
                    ? a.contact?.legalName?.localeCompare(b.contact?.legalName || "")
                    : b.contact?.legalName?.localeCompare(a.contact?.legalName || "");
                }
                if (orderBy === "status") {
                  return orderDirection === "asc"
                    ? (a.isActive ? 1 : -1) - (b.isActive ? 1 : -1)
                    : (b.isActive ? 1 : -1) - (a.isActive ? 1 : -1);
                }
                return 0;
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user, index) => (
                <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell sx={{ border: "1px solid #ccc" }}>{index + 1}</TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>{user.username || "N/A"}</TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>{user.contact?.legalName || "N/A"}</TableCell>

                  {/* Display logged in status with circle icon and text */}
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: user.isLoggedin ? "green" : "red", width: 24, height: 24, marginRight: 1 }} />
                      <Typography variant="body2">{user.isLoggedin ? "Yes" : "No"}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", padding: 2 }}>
                    {user.isLoggedin ? (
                      <Typography variant="body2" sx={{ marginLeft: 1, color: "grey", fontWeight: "bold" }}>
                        Logged in Duration :
                        <Typography
                          component="span"
                          sx={{ marginLeft: 1, color: "green", fontWeight: "bold", fontSize: "20px" }}
                        >
                          {userLoginDurations[user.id]}
                        </Typography>
                      </Typography>
                    ) : userLoginDurations[user.id] && userLoginDurations[user.id] !== 'No login data' ? (
                      <Typography variant="body2" sx={{ marginLeft: 1, color: "grey", fontWeight: "bold" }}>
                        Offline Duration :
                        <Typography
                          component="span"
                          sx={{ marginLeft: 1, fontSize: "20px", color: "red", fontWeight: "bold" }}
                        >
                          {userLoginDurations[user.id]}
                        </Typography>
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ marginLeft: 1, color: "gray" }}>
                        <Typography component="span" sx={{ color: "darkgray", fontSize: "16px" }}>
                          No login data available
                        </Typography>
                      </Typography>
                    )}
                  </TableCell>
                  {/* Display active status with circle icon and text */}
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: user.isActive ? "green" : "red", width: 24, height: 24, marginRight: 1 }} />
                      <Typography variant="body2">{user.isActive ? "Active" : "Inactive"}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    <Box display="flex" justifyContent="center">
                      <IconButton color="secondary" onClick={() => handleEdit(user)}>
                        <Edit />
                      </IconButton>
                      {/* <IconButton color="warning" onClick={() => handleResetPassword(user)}>
                        <LockReset />
                      </IconButton> */}
                      <IconButton
                        color={user.isActive ? "success" : "error"}
                        onClick={() => handleToggleUserStatus(user)}
                      >
                        {user.isActive ? <CheckCircle /> : <Cancel />}
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleView(user)}>
                        <FmdGood />
                      </IconButton>
                    </Box>
                  </TableCell>


                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>


      <TablePagination
        rowsPerPageOptions={[10, 15]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={3000}
        onClose={() => setAlertMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Centered at the top
      >
        {alertMessage && (
          <Alert
            onClose={() => setAlertMessage(null)}
            severity={alertMessage.type} // ✅ Automatically sets "success" or "error"
            sx={{
              width: "100%",
              height: "100%",
              fontSize: "1.5rem", // ✅ Increases text size
              fontWeight: "bold", // ✅ Makes it bold
            }}
          >
            {alertMessage.message}
          </Alert>
        )}
      </Snackbar>

    </Box>
  );
}
