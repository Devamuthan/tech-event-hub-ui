import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  AccountCircle,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import { getEventById, registerForEvent, cancelEventRegistration } from '../../service/api.service';
import config from '../../config/config';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const userData = JSON.parse(localStorage.getItem(config.userKey)) || null;
  const isLoggedIn = !!userData;
  const isOrganizer = userData && event && userData.id === event.organizer?.id;
  const isAdmin = userData && userData.role === 'admin';
  const canEdit = isOrganizer || isAdmin;

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const response = await getEventById(id);
      const data = response.responseData || response;
      setEvent(data);
      
      // Check if user is registered for this event
      if (data.registrations && userData) {
        const isRegistered = data.registrations.some(reg => reg.userId == userData.id);
        setRegistrationStatus(isRegistered ? 'registered' : 'not-registered');
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setRegistrationLoading(true);
    try {
      console.log('Registering for event:', {
        eventId: id,
        userId: userData.id
      });
      
      const response = await registerForEvent(id);
      
      console.log('Registration response:', response);
      
      setRegistrationStatus('registered');
    } catch (error) {
      console.error('Failed to register for event:', error);
      setError(
        error.response?.data?.responseMessage || 
        'Failed to register for this event. Please try again.'
      );
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    setRegistrationLoading(true);
    try {
      await cancelEventRegistration(id);
      setRegistrationStatus('not-registered');
    } catch (error) {
      console.error('Failed to cancel registration:', error);
      setError('Failed to cancel your registration. Please try again.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/create-event?id=${id}`);
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
    navigate('/registrations');
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/home')} 
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Event not found</Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/home')} 
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <div className="event-detail-page">
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/home')}
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Details
          </Typography>
          {canEdit && (
            <IconButton color="inherit" onClick={handleEdit} aria-label="edit event">
              <EditIcon />
            </IconButton>
          )}
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2">
                      Signed in as {userData.username}
                    </Typography>
                    {userData.role === 'admin' && (
                      <Chip 
                        label="Admin" 
                        color="primary" 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleMyRegistrations}>
                  <EventAvailableIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">My Registrations</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                  <Typography variant="body2" color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="event-detail-container">
        <Paper elevation={3} className="event-detail-paper">
          {event.imageUrl && (
            <div className="event-detail-image-container">
              <img src={event.imageUrl} alt={event.title} className="event-detail-image" />
            </div>
          )}
          
          <Box className="event-detail-content">
            <Typography variant="h4" component="h1" className="event-detail-title">
              {event.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', mt: 2 }}>
              <Chip 
                icon={<CategoryIcon />} 
                label={event.type} 
                color="primary" 
                variant="filled" 
              />
              
              <Chip 
                icon={<EventIcon />} 
                label={formatDate(event.date)} 
                variant="outlined" 
              />
              
              {event.time && (
                <Chip 
                  icon={<TimeIcon />} 
                  label={event.time} 
                  variant="outlined" 
                />
              )}
              
              {event.location && (
                <Chip 
                  icon={<LocationIcon />} 
                  label={event.location} 
                  variant="outlined" 
                />
              )}
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Typography variant="body1" className="event-detail-description">
              {event.description}
            </Typography>
            
            {event.organizer && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Organized by: {event.organizer.username}
              </Typography>
            )}
            
            <Box sx={{ mt: 4 }}>
              {isLoggedIn ? (
                registrationStatus === 'registered' ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelRegistration}
                    disabled={registrationLoading}
                    fullWidth
                  >
                    {registrationLoading ? <CircularProgress size={24} /> : 'Cancel Registration'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleRegister}
                    disabled={registrationLoading}
                    fullWidth
                  >
                    {registrationLoading ? <CircularProgress size={24} /> : 'Register for this Event'}
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                  fullWidth
                >
                  Login to Register
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default EventDetail;
