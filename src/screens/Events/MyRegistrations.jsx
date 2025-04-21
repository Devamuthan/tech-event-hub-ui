import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  AccountCircle, 
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import EventCard from '../../components/EventCard/EventCard';
import { getUserEvents } from '../../service/api.service';
import config from '../../config/config';
import '../Home/Home.css';

const MyRegistrations = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const userData = JSON.parse(localStorage.getItem(config.userKey)) || null;
  const isLoggedIn = !!userData;

  useEffect(() => {
    // Redirect to login if not logged in
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    fetchUserEvents();
  }, [navigate, isLoggedIn]);

  const fetchUserEvents = async () => {
    setLoading(true);
    try {
      const data = await getUserEvents();
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch user events:', error);
      setError('Failed to load your registered events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleMyRegistrations = () => {
    handleMenuClose();
    // Already on this page, so no navigation needed
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="home-page">
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBackToHome}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Registered Events
          </Typography>
          
          {isLoggedIn && (
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
                <MenuItem onClick={handleMyRegistrations} selected>
                  <EventAvailableIcon fontSize="small" sx={{ mr: 1 }} />
                  My Registrations
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="home-container">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Registered Events
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ my: 4 }}>
              {error}
            </Typography>
          ) : events.length > 0 ? (
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <EventCard {...event} refreshEvents={fetchUserEvents} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                You haven't registered for any events yet.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleBackToHome}
              >
                Browse Events
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default MyRegistrations;
