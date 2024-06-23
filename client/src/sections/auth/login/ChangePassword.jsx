import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

import Logo from '../../../components/logo';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    axios.post('http://localhost:8080/api/auth/change-password', { userId: user._id, newPassword: password }, { withCredentials: true })
      .then(response => {
        toast.success('Password changed successfully');
        navigate('/books');
      })
      .catch(error => {
        toast.error(error.response.data.message);
        console.log(error);
      });
  };

  return (
    <>
      <Helmet>
        <title>Change Password | Library</title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 }
          }}
        />

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" sx={{ color: '#666666', fontWeight: '600' }} textAlign="center" gutterBottom>
              Library System
            </Typography>
            <Typography variant="h3" textAlign="center" gutterBottom>
              Change Password
            </Typography>

            <Stack spacing={3} sx={{ mt: 3 }}>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button variant="contained" size="large" onClick={handleChangePassword}>
                Change Password
              </Button>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
