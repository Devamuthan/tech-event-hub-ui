import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Button, 
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  AccountCircle, 
  Logout as LogoutIcon,
  Login as LoginIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import config from '../../config/config';

const Navbar = ({ children }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const userData = JSON.parse(localStorage.getItem(config.userKey)) || null;
  const isLoggedIn = !!userData;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
    handleMenuClose();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  const handleMyRegistrations = () => {
    handleMenuClose();
    navigate('/registrations');
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tech Event Hub
          </Typography>
          
          {isLoggedIn && userData.role === 'admin' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleCreateEvent}
              sx={{ mr: 2 }}
            >
              Create Event
            </Button>
          )}
          
          {isLoggedIn ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {userData.username}
                  {userData.role === 'admin' && (
                    <Chip 
                      label="Admin" 
                      color="secondary" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    Signed in as {userData.username}
                    {userData.role === 'admin' && (
                      <Chip 
                        label="Admin" 
                        color="primary" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleMyRegistrations}>
                  <EventAvailableIcon fontSize="small" sx={{ mr: 1 }} />
                  My Registrations
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </div>
  );
};

export default Navbar;
