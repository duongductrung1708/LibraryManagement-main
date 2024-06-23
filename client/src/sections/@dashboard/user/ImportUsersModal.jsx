import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Modal, Typography } from '@mui/material';
import { parse } from 'papaparse';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl, methods, routes } from '../../../constants';

const ImportUsersModal = ({ isOpen, onClose }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'white',
    borderRadius: '20px',
    boxShadow: 16,
    p: 4,
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    parse(file, {
      complete: (results) => {
        const users = results.data;
        const formattedUsers = users.map(user => ({
          ...user,
          password: user.password || Math.random().toString(36).slice(-8),
        }));

        axios.post(apiUrl(routes.USER, methods.IMPORT), { users: formattedUsers })
          .then(response => {
            toast.success('Users imported successfully');
            onClose();
          })
          .catch(error => {
            console.error('Error importing users:', error);
            toast.error('Error importing users');
          });
          console.log('Formatted Users:', formattedUsers);
      },
      header: true,
    });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ ...style }}>
        <Typography variant="h6" textAlign="center">Import Users</Typography>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button variant="contained" onClick={handleImport} sx={{ mt: 2 }}>Import</Button>
      </Box>
    </Modal>
  );
};

ImportUsersModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImportUsersModal;
