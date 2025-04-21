import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Screens
import Home from './screens/Home/Home';
import Login from './screens/Auth/Login/Login';
import Register from './screens/Auth/Register/Register';
import CreateEvent from './screens/Events/CreateEvent';
import EventDetail from './screens/Events/EventDetail';
import MyRegistrations from './screens/Events/MyRegistrations';

// Config
import ProtectedRoute from './config/Route/ProtectedRoute';
import { configureTheme, getTheme } from './theme/theme';

// Styles
import './App.css';

function App() {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    configureTheme(setTheme);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={<ProtectedRoute element={<Home />} />} 
            />
            <Route 
              path="/home" 
              element={<ProtectedRoute element={<Home />} />} 
            />
            <Route 
              path="/event/:id" 
              element={<ProtectedRoute element={<EventDetail />} />} 
            />
            <Route 
              path="/create-event" 
              element={<ProtectedRoute element={<CreateEvent />} allowedRoles={['admin']} />} 
            />
            <Route 
              path="/registrations" 
              element={<ProtectedRoute element={<MyRegistrations />} />} 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<ProtectedRoute element={<Home />} />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
