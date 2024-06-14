import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, CircularProgress, Button, Stack, Container } from '@mui/material';
import toast from 'react-hot-toast';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import { apiUrl, methods, routes } from '../../../constants';
import UserForm from './UserFormForUser';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 4,
  };

  const getUser = useCallback(() => {
    setLoading(true);
    axios
      .get(apiUrl(routes.USER, `${methods.GET}/${id}`), { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const updateUser = () => {
    axios
      .put(apiUrl(routes.USER, `${methods.PUT}/${id}`), user)
      .then((response) => {
        toast.success('User updated');
        handleCloseModal();
        getUser();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const clearForm = () => {
    setUser({
      name: '',
      dob: '',
      email: '',
      password: '',
      phone: '',
      isAdmin: false,
      photoUrl: '',
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsUpdateForm(true);
  };

  const handleOpenHistory = () => {
    navigate(`/userprofile/history/${id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsUpdateForm(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={style}>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <Container>
        <Stack spacing={3} paddingY={2} alignItems={'center'}>
          <Avatar src={user.photoUrl} alt={user.name} sx={{ width: 100, height: 100 }} />
          <Typography variant="h4" style={{ textAlign: 'center', width: '35%' }}>
            {user.name} -{' '}
            {user.isAdmin ? <Label color="error">Admin</Label> : user.isLibrarian ? <Label color="info">Librarian</Label> : <Label color="success">Member</Label>}
          </Typography>
          <Typography variant="body1" style={{ width: '35%' }}>
            Your Email: {user.email}
          </Typography>
          <Typography variant="body1" style={{ width: '35%' }}>
            Your Dob: {new Date(user.dob).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" style={{ width: '35%' }}>
            Phone Number: {user.phone}
          </Typography>
          <Button variant="contained" onClick={handleOpenModal} startIcon={<Iconify icon="eva:edit-fill" />}>
            Edit
          </Button>
          {user.isAdmin || user.isLibrarian ? null : (
            <Button variant="contained" onClick={handleOpenHistory} startIcon={<Iconify icon="eva:book-outline" />}>
              Borrowal History
            </Button>
          )}
        </Stack>
        <UserForm
          isUpdateForm={isUpdateForm}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          user={user}
          setUser={setUser}
          handleUpdateUser={updateUser}
        />
      </Container>
    </Box>
  );
}
