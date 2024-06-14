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
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import Iconify from '../../../components/iconify';
import { useAuth } from '../../../hooks/useAuth';

const BorrowalForm = ({
  handleAddBorrowal,
  handleUpdateBorrowal,
  isUpdateForm,
  isModalOpen,
  handleCloseModal,
  borrowal,
  setBorrowal,
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
    if (!user.isAdmin && !user.isLibrarian) {
      setBorrowal((prev) => ({
        ...prev,
        borrowedDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
        status: 'pending',
      }));
    }
  }, [user, setBorrowal]);

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
                  <InputLabel id="member-label">Member</InputLabel>
                  <Select
                    required
                    disabled={!isAdminOrLibrarian}
                    labelId="member-label"
                    id="member"
                    value={borrowal.memberId}
                    label="Member"
                    onChange={(e) => setBorrowal({ ...borrowal, memberId: e.target.value })}
                  >
                    {members.map((member) => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} paddingLeft={1}>
                <FormControl sx={{ m: 0 }} fullWidth>
                  <InputLabel id="book-label">Book</InputLabel>
                  <Select
                    required
                    labelId="book-label"
                    id="book"
                    value={borrowal.bookId}
                    label="Book"
                    onChange={(e) => setBorrowal({ ...borrowal, bookId: e.target.value })}
                  >
                    {availableBooks.map((book) => (
                      <MenuItem key={book._id} value={book._id}>
                        {book.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={0} sx={{ paddingBottom: '4px' }}>
              <Grid item xs={12} md={6} paddingRight={1}>
                <TextField
                  fullWidth
                  name="borrowedDate"
                  label="Borrowed date"
                  type="date"
                  value={borrowal.borrowedDate}
                  required
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setBorrowal({ ...borrowal, borrowedDate: e.target.value })}
                  disabled={!isAdminOrLibrarian}
                />
              </Grid>
              <Grid item xs={12} md={6} paddingLeft={1}>
                <TextField
                  fullWidth
                  name="dueDate"
                  label="Due date"
                  type="date"
                  value={borrowal.dueDate}
                  required
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setBorrowal({ ...borrowal, dueDate: e.target.value })}
                  disabled={!isAdminOrLibrarian}
                />
              </Grid>
            </Grid>

            <FormControl sx={{ m: 0 }} fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={borrowal.status}
                label="Status"
                onChange={(e) => setBorrowal({ ...borrowal, status: e.target.value })}
                disabled={!isAdminOrLibrarian}
              >
                <MenuItem value="pending">
                  <HourglassEmptyIcon style={{ marginRight: 8 }} /> Pending
                </MenuItem>
                <MenuItem value="accepted">
                  <CheckCircleIcon style={{ marginRight: 8 }} /> Accepted
                </MenuItem>
                <MenuItem value="rejected">
                  <CancelIcon style={{ marginRight: 8 }} /> Rejected
                </MenuItem>
                <MenuItem value="returned">
                  <ReplayIcon style={{ marginRight: 8 }} /> Returned
                </MenuItem>
              </Select>
            </FormControl>

            <br />
            <Box textAlign="center">
              <Box textAlign="center" paddingBottom={2}>
                <Button
                  size="large"
                  variant="contained"
                  onClick={isUpdateForm ? handleUpdateBorrowal : handleAddBorrowal}
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

BorrowalForm.propTypes = {
  isUpdateForm: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func,
  borrowal: PropTypes.object,
  setBorrowal: PropTypes.func,
  handleAddBorrowal: PropTypes.func,
  handleUpdateBorrowal: PropTypes.func,
};

export default BorrowalForm;
