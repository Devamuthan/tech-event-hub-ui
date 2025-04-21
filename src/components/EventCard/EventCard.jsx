import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { deleteEvent } from '../../service/api.service';
import config from '../../config/config';
import './EventCard.css';

const EventCard = ({
  id,
  title,
  description,
  type,
  date,
  time,
  location,
  imageUrl,
  organizer,
  refreshEvents
}) => {
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const userData = JSON.parse(localStorage.getItem(config.userKey)) || null;
  const isOrganizer = userData && userData.id === organizer?.id;
  const isAdmin = userData && userData.role === 'admin';
  const canEdit = isOrganizer || isAdmin;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleEdit = () => {
    navigate(`/create-event?id=${id}`);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
      if (refreshEvents) {
        refreshEvents();
      }
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/event/${id}`);
  };

  const getEventTypeColor = (eventType) => {
    const typeColors = {
      'Workshop': '#3f51b5',
      'Hackathon': '#f50057',
      'Conference': '#00bcd4',
      'Meetup': '#4caf50',
      'Webinar': '#ff9800',
    };
    
    return typeColors[eventType] || '#9e9e9e';
  };

  return (
    <Card className="event-card">
      {imageUrl && (
        <div className="event-card-image-container">
          <img src={imageUrl} alt={title} className="event-card-image" />
        </div>
      )}
      
      <CardContent className="event-card-content">
        <Typography variant="h5" component="h2" className="event-card-title">
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CategoryIcon />} 
            label={type} 
            size="small" 
            sx={{ 
              backgroundColor: getEventTypeColor(type),
              color: 'white'
            }}
          />
          
          <Chip 
            icon={<EventIcon />} 
            label={formatDate(date)} 
            size="small" 
            variant="outlined" 
          />
          
          {time && (
            <Chip 
              icon={<TimeIcon />} 
              label={time} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" className="event-card-description">
          {description.length > 150 ? `${description.substring(0, 150)}...` : description}
        </Typography>
      </CardContent>
      
      <CardActions className="event-card-actions">
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        
        {canEdit && (
          <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
            <IconButton 
              size="small" 
              color="primary" 
              onClick={handleEdit}
              aria-label="edit event"
            >
              <EditIcon />
            </IconButton>
            
            <IconButton 
              size="small" 
              color="error" 
              onClick={handleOpenDeleteDialog}
              aria-label="delete event"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </CardActions>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Event
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EventCard;
