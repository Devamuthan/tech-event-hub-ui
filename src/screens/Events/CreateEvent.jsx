import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createEvent, getEventById, updateEvent } from '../../service/api.service';
import config from '../../config/config';
import './CreateEvent.css';

const eventTypes = [
  'Workshop',
  'Hackathon',
  'Conference',
  'Meetup',
  'Webinar',
  'Other'
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('id');
  const isEditMode = !!eventId;

  const [event, setEvent] = useState({
    title: '',
    description: '',
    type: '',
    date: null,
    time: null,
    location: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem(config.userKey));
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch event details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      console.log('eventId ', eventId)
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    setFetchLoading(true);
    try {
      const response = await getEventById(eventId);
      const data = response.responseData || response;
      setEvent({
        title: data.title || '',
        description: data.description || '',
        type: data.type || '',
        date: data.date ? dayjs(data.date) : null,
        time: data.time ? dayjs(data.time, 'HH:mm') : null,
        location: data.location || '',
        imageUrl: data.imageUrl || '',
      });
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      setError('Failed to load event details. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newDate) => {
    setEvent((prev) => ({ ...prev, date: newDate }));
  };

  const handleTimeChange = (newTime) => {
    setEvent((prev) => ({ ...prev, time: newTime }));
  };

  const validateForm = () => {
    if (!event.title) {
      setError('Title is required');
      return false;
    }
    if (!event.description) {
      setError('Description is required');
      return false;
    }
    if (!event.type) {
      setError('Event type is required');
      return false;
    }
    if (!event.date) {
      setError('Date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    const formattedEvent = {
      ...event,
      date: event.date ? event.date.format('YYYY-MM-DD') : null,
      time: event.time ? event.time.format('HH:mm') : null,
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await updateEvent(eventId, formattedEvent);
        setSuccess('Event updated successfully!');
      } else {
        await createEvent(formattedEvent);
        setSuccess('Event created successfully!');
        // Reset form after successful creation
        setEvent({
          title: '',
          description: '',
          type: '',
          date: null,
          time: null,
          location: '',
          imageUrl: '',
        });
      }
      
      // Navigate back to home after a short delay
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (error) {
      console.error('Error saving event:', error);
      setError(error.response?.data?.message || 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="create-event-page">
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
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="create-event-container">
        <Paper elevation={3} className="create-event-paper">
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Event Title"
                  name="title"
                  value={event.title}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Event Description"
                  name="description"
                  multiline
                  rows={4}
                  value={event.description}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="event-type-label">Event Type</InputLabel>
                  <Select
                    labelId="event-type-label"
                    id="type"
                    name="type"
                    value={event.type}
                    label="Event Type"
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="location"
                  label="Location"
                  name="location"
                  value={event.location}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="Physical location or 'Online'"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Event Date *"
                    value={event.date}
                    onChange={handleDateChange}
                    disabled={loading}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                    slotProps={{
                      textField: { fullWidth: true, required: true }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Event Time"
                    value={event.time}
                    onChange={handleTimeChange}
                    disabled={loading}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    slotProps={{
                      textField: { fullWidth: true }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="imageUrl"
                  label="Image URL"
                  name="imageUrl"
                  value={event.imageUrl}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/home')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : isEditMode ? (
                      'Update Event'
                    ) : (
                      'Create Event'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default CreateEvent;
