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
  FormControl,
  InputLabel,
  Select,
  Chip
} from '@mui/material';
import { 
  Add as AddIcon, 
  AccountCircle, 
  Logout as LogoutIcon,
  Login as LoginIcon,
  FilterList as FilterIcon,
  EventAvailable as EventAvailableIcon
} from '@mui/icons-material';
import EventCard from '../../components/EventCard/EventCard';
import { getEvents } from '../../service/api.service';
import config from '../../config/config';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('');
  
  const userData = JSON.parse(localStorage.getItem(config.userKey)) || null;
  const isLoggedIn = !!userData;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setError('Failed to load events. Please try again later.');
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

  const handleLogin = () => {
    navigate('/login');
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };
  
  const handleMyRegistrations = () => {
    handleMenuClose();
    navigate('/my-registrations');
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const filteredEvents = filterType 
    ? events.filter(event => event.type === filterType)
    : events;

  const eventTypes = [...new Set(events.map(event => event.type))];

  return (
    <div className="home-page">
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

      <Container maxWidth="lg" className="home-container">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Upcoming Tech Events
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="filter-type-label">
                <FilterIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Filter by Type
              </InputLabel>
              <Select
                labelId="filter-type-label"
                id="filter-type"
                value={filterType}
                label="Filter by Type"
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              onClick={fetchEvents}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ my: 4 }}>
              {error}
            </Typography>
          ) : filteredEvents.length > 0 ? (
            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <EventCard {...event} refreshEvents={fetchEvents} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography align="center" sx={{ my: 4 }}>
              No events found. {isLoggedIn && userData.role === 'admin' && 'Create one by clicking the "Create Event" button!'}
            </Typography>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Home;
