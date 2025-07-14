import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const WinnerDeclaration = () => {
  const [mobile, setMobile] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // default: today
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(mobile)) {
      setSnackbar({
        open: true,
        message: 'Enter a valid 10-digit mobile number',
        severity: 'error',
      });
      return;
    }

    const payload = {
      mobile,
      date: selectedDate,
    };

    try {
      const response = await axios.post(
        'https://your-backend-url.com/api/winner',
        payload
      );
      setSnackbar({
        open: true,
        message: 'Winner declared successfully!',
        severity: 'success',
      });
      console.log('Success:', response.data);
      setMobile('');
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to declare winner. Try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Typography
          sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
          variant="h4"
        >
          Winner Declaration
        </Typography>
      </Box>

      {/* Form Section */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Enter Mobile Number"
              variant="outlined"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              fullWidth
              required
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              label="Select Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <Button variant="contained" color="primary" type="submit">
              Winner Declaration
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as 'success' | 'error'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WinnerDeclaration;
