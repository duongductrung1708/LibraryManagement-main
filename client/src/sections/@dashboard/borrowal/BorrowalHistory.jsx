import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { Alert } from '@mui/lab';
import {
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import AcceptedIcon from '@mui/icons-material/CheckCircle';
import RejectedIcon from '@mui/icons-material/Cancel';
import ReturnedIcon from '@mui/icons-material/Replay';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import BorrowalListHead from './BorrowalListHead';
import BorrowalsDialog from './BorrowalDialog';
import { applySortFilter, getComparator } from '../../../utils/tableOperations';
import { apiUrl, methods, routes } from '../../../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'memberName', label: 'Member Name', alignRight: false },
  { id: 'bookName', label: 'Book Name', alignRight: false },
  { id: 'borrowedDate', label: 'Borrowed On', alignRight: false },
  { id: 'dueDate', label: 'Due On', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: '', alignRight: true },
  { id: '', label: '', alignRight: false },
];

// ----------------------------------------------------------------------

const BorrowalHistory = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('memberName');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Data
  const [borrowal, setBorrowal] = useState({
    bookId: '',
    memberId: '',
    borrowedDate: '',
    dueDate: '',
    status: '',
  });
  const [borrowals, setBorrowals] = useState([]);
  const [selectedBorrowalId, setSelectedBorrowalId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // API operations
  const getAllBorrowals = useCallback(() => {
    axios
      .get(apiUrl(routes.BORROWAL, methods.GET_ALL))
      .then((response) => {
        const currentDate = new Date();
        const filteredBorrowals = response.data.borrowalsList.filter(
          (borrowal) => new Date(borrowal.dueDate) < currentDate
        );
        setBorrowals(
          user.isAdmin ? filteredBorrowals : filteredBorrowals.filter((borrowal) => user._id === borrowal.memberId)
        );
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user.isAdmin, user._id]);

  // Load data on initial page load
  useEffect(() => {
    getAllBorrowals();
  }, [getAllBorrowals]);

  const deleteBorrowal = () => {
    axios
      .delete(apiUrl(routes.BORROWAL, methods.PUT, selectedBorrowalId))
      .then((response) => {
        toast.success('Borrowal deleted');
        handleCloseDialog();
        handleCloseMenu();
        getAllBorrowals();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const handleOpenMenu = (event) => {
    setIsMenuOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(null);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleBack = () => {
    navigate(`/userprofile/${id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'accepted':
        return <AcceptedIcon color="success" />;
      case 'rejected':
        return <RejectedIcon color="error" />;
      case 'returned':
        return <ReturnedIcon color="info" />;
      default:
        return null;
    }
  };

  const sortedBorrowals = applySortFilter(borrowals, getComparator(order, orderBy), filterName);

  return (
    <>
      <Helmet>
        <title>Borrowals History</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Borrowals History
          </Typography>
        </Stack>
        <Button variant="contained" onClick={handleBack} startIcon={<Iconify icon="eva:arrow-back-outline" />}>
          Back
        </Button>
        {isTableLoading ? (
          <Grid style={{ textAlign: 'center' }}>
            <CircularProgress size="lg" />
          </Grid>
        ) : (
          <Card>
            <Scrollbar>
              {sortedBorrowals.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <BorrowalListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={borrowals.length}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {sortedBorrowals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((borrowal) => (
                        <TableRow hover key={borrowal._id} tabIndex={-1}>
                          <TableCell align="left">{borrowal.member.name}</TableCell>
                          <TableCell align="left">{borrowal.book.name}</TableCell>
                          <TableCell align="left">
                            {new Date(borrowal.borrowedDate).toLocaleDateString('en-US')}
                          </TableCell>
                          <TableCell align="left">{new Date(borrowal.dueDate).toLocaleDateString('en-US')}</TableCell>
                          <TableCell align="left" style={{ textTransform: 'uppercase' }}>
                            {getStatusIcon(borrowal.status)} {borrowal.status}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(borrowal.dueDate) < new Date() && (
                              <Label color="error" sx={{ padding: 2 }}>
                                Overdue
                              </Label>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="large"
                              color="inherit"
                              onClick={(e) => {
                                setSelectedBorrowalId(borrowal._id);
                                handleOpenMenu(e);
                              }}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="warning" color="warning">
                  No borrowals found
                </Alert>
              )}
            </Scrollbar>
            {sortedBorrowals.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={borrowals.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Card>
        )}
      </Container>

      <Popover
        open={Boolean(isMenuOpen)}
        anchorEl={isMenuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDialog}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <BorrowalsDialog
        isDialogOpen={isDialogOpen}
        borrowalsId={selectedBorrowalId}
        handleDeleteBorrowal={deleteBorrowal}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default BorrowalHistory;
