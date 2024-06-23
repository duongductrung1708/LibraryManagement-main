import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
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
  InputAdornment,
  MenuItem,
  OutlinedInput,
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
import SearchIcon from '@mui/icons-material/Search';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import AcceptedIcon from '@mui/icons-material/CheckCircle';
import RejectedIcon from '@mui/icons-material/Cancel';
import ReturnedIcon from '@mui/icons-material/Replay';
import { useAuth } from '../../../hooks/useAuth';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

import BorrowalListHead from './BorrowalListHead';
import BorrowalForm from './BorrowalForm';
import BorrowalFormForUser from "./BorowalFormForUser"
import BorrowalsDialog from './BorrowalDialog';
import { applySortFilter, getComparator } from '../../../utils/tableOperations';
import { apiUrl, methods, routes } from '../../../constants';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'memberName', label: 'Member Name', alignRight: false },
  { id: 'bookName', label: 'Book Name', alignRight: false },
  { id: 'RequestDate', label: 'Request On', alignRight: false },
  { id: 'borrowedDate', label: 'Borrowed On', alignRight: false },
  { id: 'dueDate', label: 'Due On', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '', label: '', alignRight: true },
  { id: '', label: '', alignRight: false },
];

// ----------------------------------------------------------------------

const BorrowalPage = () => {
  const { user } = useAuth();
  // State variables
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [memberNameFilter, setMemberNameFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Data
  const [borrowal, setBorrowal] = useState({
    bookId: '',
    memberId: '',
    borrowedDate: '',
    dueDate: '',
    status: '',
    overdue: false,
  });
  const [borrowals, setBorrowals] = useState([]);
  const [selectedBorrowalId, setSelectedBorrowalId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // Load data on initial page load
  useEffect(() => {
    getAllBorrowals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // API operations
  const getAllBorrowals = () => {
    axios
      .get(apiUrl(routes.BORROWAL, methods.GET_ALL))
      .then((response) => {
        // handle success
        console.log(response.data);
        if (user.isAdmin || user.isLibrarian) {
          setBorrowals(response.data.borrowalsList);
        } else {
          setBorrowals(response.data.borrowalsList.filter((borrowal) => user._id === borrowal.memberId));
        }
        setIsTableLoading(false);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const addBorrowal = () => {
    axios
      .post(apiUrl(routes.BORROWAL, methods.POST), borrowal)
      .then((response) => {
        toast.success('Borrowal added');
        console.log(response.data);
        handleCloseModal();
        getAllBorrowals();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const updateBorrowal = () => {
    axios
      .put(apiUrl(routes.BORROWAL, methods.PUT, selectedBorrowalId), borrowal)
      .then((response) => {
        const updatedStatus = borrowal.status;
        let toastMessage = '';

        switch (updatedStatus) {
          case 'pending':
            toastMessage = 'Borrowal status changed to pending';
            break;
          case 'accepted':
            toastMessage = 'Borrowal status changed to accepted';
            break;
          case 'rejected':
            toastMessage = 'Borrowal status changed to rejected';
            break;
          case 'returned':
            toastMessage = 'Borrowal status changed to returned';
            break;
          default:
            toastMessage = 'Borrowal status updated';
            break;
        }

        toast.success(toastMessage);

        console.log(response.data);
        handleCloseModal();
        handleCloseMenu();
        getAllBorrowals();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const deleteBorrowal = () => {
    axios
      .delete(apiUrl(routes.BORROWAL, methods.DELETE, selectedBorrowalId))
      .then((response) => {
        toast.success('Borrowal deleted');
        handleCloseDialog();
        handleCloseMenu();
        console.log(response.data);
        getAllBorrowals();
      })
      .catch((error) => {
        console.log(error);
        toast.error('Something went wrong, please try again');
      });
  };

  const getSelectedBorrowalDetails = () => {
    const selectedBorrowals = borrowals.find((element) => element._id === selectedBorrowalId);
    setBorrowal(selectedBorrowals);
  };

  const clearForm = () => {
    setBorrowal({
      bookId: '',
      memberId: '',
      borrowedDate: '',
      dueDate: '',
      status: '',
    });
  };

  // Handler functions
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

  const handleFilterByName = (event) => {
    setMemberNameFilter(event.target.value);
  };

  // Table functions
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const filteredBorrowals = applySortFilter(
    borrowals.filter((borrowal) =>
      borrowal.member.name.toLowerCase().includes(memberNameFilter.toLowerCase())
    ),
    getComparator(order, orderBy)
  );

  return (
    <>
      <Helmet>
        <title>Borrowals</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Borrowals
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setIsUpdateForm(false);
              handleOpenModal();
            }}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Borrowal
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <OutlinedInput
            value={memberNameFilter}
            onChange={handleFilterByName}
            placeholder="Search by member name..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            sx={{ width: 240 }}
          />
        </Stack>
        {isTableLoading ? (
          <Grid style={{ textAlign: 'center' }}>
            <CircularProgress size="lg" />
          </Grid>
        ) : (
          <Card>
            <Scrollbar>
            {filteredBorrowals.length > 0 ? (
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <BorrowalListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={filteredBorrowals.length}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
  {filteredBorrowals
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((borrowal) => {
      // Kiểm tra và đặt thuộc tính overdue
      const isOverdue = borrowal.dueDate && new Date(borrowal.dueDate) < new Date();
      borrowal.overdue = isOverdue ? true : borrowal.dueDate ? false : 'no data';
      
      return (
        <TableRow hover key={borrowal._id} tabIndex={-1}>
          <TableCell align="left">{borrowal.member.name}</TableCell>
          <TableCell align="left">{borrowal.book.name}</TableCell>
          <TableCell align="left">
            {new Date(borrowal.requestDate).toLocaleDateString('en-US')}
          </TableCell>
          <TableCell align="left">
            {borrowal.status === 'pending' || borrowal.status === 'rejected'
              ? 'none'
              : new Date(borrowal.borrowedDate).toLocaleDateString('en-US')}
          </TableCell>
          <TableCell align="left">
            {borrowal.status === 'pending' || borrowal.status === 'rejected'
              ? 'none'
              : borrowal.dueDate
              ? new Date(borrowal.dueDate).toLocaleDateString('en-US')
              : 'No Data'}
          </TableCell>
          <TableCell align="left" style={{ textTransform: 'uppercase' }}>
            {getStatusIcon(borrowal.status)} {borrowal.status}
          </TableCell>
          <TableCell align="left">
            {borrowal.overdue === true && (
              <Label color="error" sx={{ padding: 2 }}>
                Overdue
              </Label>
            )}
            {borrowal.overdue === 'no data' && (
              <Label color="warning" sx={{ padding: 2 }}>
                No Data
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
      );
    })}
</TableBody>

                </Table>
              </TableContainer>
            ) : (
              <Alert severity="warning" color="warning">
                No borrowals found
              </Alert>
            )}
            </Scrollbar>
            {filteredBorrowals.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredBorrowals.length}
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
        <MenuItem
          onClick={() => {
            setIsUpdateForm(true);
            getSelectedBorrowalDetails();
            handleCloseMenu();
            handleOpenModal();
          }}
        >
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDialog}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      {user.isAdmin || user.isLibrarian ? (
        <BorrowalForm
          isUpdateForm={isUpdateForm}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          id={selectedBorrowalId}
          borrowal={borrowal}
          setBorrowal={setBorrowal}
          handleAddBorrowal={addBorrowal}
          handleUpdateBorrowal={updateBorrowal}
        />
      ) : (
        <BorrowalFormForUser
          isUpdateForm={isUpdateForm}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          id={selectedBorrowalId}
          borrowal={borrowal}
          setBorrowal={setBorrowal}
          handleAddBorrowal={addBorrowal}
          handleUpdateBorrowal={updateBorrowal}
        />
      )}
      

      <BorrowalsDialog
        isDialogOpen={isDialogOpen}
        borrowalsId={selectedBorrowalId}
        handleDeleteBorrowal={deleteBorrowal}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default BorrowalPage;
