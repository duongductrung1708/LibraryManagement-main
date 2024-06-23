import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../hooks/useAuth';

const BorrowalFormForUser = ({
  handleAddBorrowal,
  handleUpdateBorrowal,
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  borrowal,
  setBorrowal,
  id,
  bookName
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);

  const getAllMembers = useCallback(() => {
    axios
      .get('http://localhost:8080/api/user/getAllMembers')
      .then((response) => {
        const filteredMembers = response.data.membersList.filter(
          (member) => !(member.isLibrarian && user.isLibrarian)
        );
        if (user.isAdmin || user.isLibrarian) {
          setMembers(filteredMembers);
        } else {
          setMembers(filteredMembers.filter((member) => user._id === member._id));
        }
        setBorrowal((prev) => ({ ...prev, memberId: user._id }));
      })
      .catch((error) => {
        toast.error('Error fetching members');
        console.log(error);
      });
  }, [setBorrowal, user]);

  const getAllBooks = useCallback(() => {
    axios
      .get('http://localhost:8080/api/book/getAll')
      .then((response) => {
        const allBooks = response.data.booksList;
        setBooks(allBooks);
        const availableBooksList = allBooks.filter((book) => book.isAvailable);
        setAvailableBooks(availableBooksList);
      })
      .catch((error) => {
        toast.error('Error fetching books');
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getAllMembers();
    getAllBooks();
  }, [getAllMembers, getAllBooks]);

  useEffect(() => {
    if (!isUpdateForm) {
      setBorrowal((prev) => ({
        ...prev,
        requestDate: new Date().toISOString().split('T')[0], 
        status: 'pending', 
        bookId: id, 
      }));
    }
  }, [setBorrowal, isUpdateForm, id]);

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

  const isAdminOrLibrarian = user.isAdmin || user.isLibrarian;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isUpdateForm) {
      handleUpdateBorrowal();
    } else {
      handleAddBorrowal();
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Container>
          <Typography variant="h4" textAlign="center" paddingBottom={2} paddingTop={1}>
            {isUpdateForm ? 'Update' : 'Add'} borrowal
          </Typography>
          <Stack spacing={3} paddingY={2}>
            <Grid container spacing={0} sx={{ paddingBottom: '4px' }}>
              <Grid item xs={12} md={6} paddingRight={1}>
                <FormControl sx={{ m: 0 }} fullWidth>
                <Typography variant="subtitle1" id="member-label" aria-describedby="member-label" paddingBottom={1}>
                Member
              </Typography>
              <Typography variant="body1" id="member-name">
                {user.name}
              </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} paddingLeft={1}>
                <FormControl sx={{ m: 0 }} fullWidth>
                <Typography variant="subtitle1" id="member-label" aria-describedby="member-label" paddingBottom={1}>
                Member
              </Typography>
              <Typography variant="body1" id="member-name">
                {bookName}
              </Typography>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={0} sx={{ paddingBottom: '4px' }}>
              <Grid item xs={12} md={6} paddingRight={1}>
                <TextField
                  fullWidth
                  name="requestDate"
                  label="Request date"
                  type="date"
                  value={borrowal.requestDate}
                  required
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setBorrowal({ ...borrowal, requestDate: e.target.value })}
                  disabled={isAdminOrLibrarian}
                />
              </Grid>
            </Grid>

            <br />
            <Box textAlign="center">
              <Box textAlign="center" paddingBottom={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={<Iconify icon="bi:check-lg" />}
                  style={{ marginRight: '12px' }}
                >
                  Submit
                </Button>

                <Button
                  size="large"
                  color="inherit"
                  variant="contained"
                  onClick={handleCloseModal}
                  startIcon={<Iconify icon="charm:cross" />}
                  style={{ marginLeft: '12px' }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Modal>
  );
};

BorrowalFormForUser.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  borrowal: PropTypes.object,
  setBorrowal: PropTypes.func,
  handleAddBorrowal: PropTypes.func,
  handleUpdateBorrowal: PropTypes.func,
  id: PropTypes.string,
  bookName: PropTypes.string,
};

export default BorrowalFormForUser;
