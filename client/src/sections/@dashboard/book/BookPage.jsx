import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  OutlinedInput,
  Popover,
  Stack,
  Typography,
  Select,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Alert } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';

import Label from '../../../components/label';
import BookDialog from './BookDialog';
import BookForm from './BookForm';
import Iconify from '../../../components/iconify';
import { apiUrl, methods, routes } from '../../../constants';
import BorrowalFormForUser from '../borrowal/BorowalFormForUser';
import BorrowalForm from '../borrowal/BorrowalForm';

// ----------------------------------------------------------------------

const StyledBookImage = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const TruncatedTypography = styled(Typography)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 5,
  WebkitBoxOrient: 'vertical',
  position: 'relative',
  '&::after': {
    content: '"..."',
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: 'white',
  },
});

const BookPage = () => {
  const { user } = useAuth();

  // State variables
  const [book, setBook] = useState({
    id: '',
    name: '',
    isbn: '',
    summary: '',
    isAvailable: true,
    authorId: '',
    genreId: '',
    photoUrl: '',
    pageUrls: [],
    position: '',
  });

  const [borrowal, setBorrowal] = useState({
    bookId: '',
    memberId: '',
    borrowedDate: '',
    dueDate: '',
    status: '',
  });

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);
  const [isBorrowalModalOpen, setIsBorrowalModalOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterIsAvailable, setFilterIsAvailable] = useState('');
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);

  // API operations

  const getAllBooks = () => {
    axios
      .get(apiUrl(routes.BOOK, methods.GET_ALL))
      .then((response) => {
        setBooks(response.data.booksList);
        setFilteredBooks(response.data.booksList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        toast.error('Failed to fetch books');
      });
  };

  const addBook = () => {
    axios
      .post(apiUrl(routes.BOOK, methods.POST), book)
      .then((response) => {
        toast.success('Book added successfully');
        handleCloseModal();
        getAllBooks();
        clearForm();
      })
      .catch((error) => {
        console.error('Error adding book:', error);
        toast.error('Failed to add book');
      });
  };

  const updateBook = () => {
    axios
      .put(apiUrl(routes.BOOK, methods.PUT, selectedBookId), book)
      .then((response) => {
        toast.success('Book updated successfully');
        handleCloseModal();
        handleCloseMenu();
        getAllBooks();
        clearForm();
      })
      .catch((error) => {
        console.error('Error updating book:', error);
        toast.error('Failed to update book');
      });
  };

  const deleteBook = (bookId) => {
    axios
      .delete(apiUrl(routes.BOOK, methods.DELETE, bookId))
      .then((response) => {
        toast.success('Book deleted successfully');
        handleCloseDialog();
        handleCloseMenu();
        getAllBooks();
      })
      .catch((error) => {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      });
  };

  const addBorrowal = () => {
    axios
      .post(apiUrl(routes.BORROWAL, methods.POST), borrowal)
      .then((response) => {
        toast.success('Borrowal added successfully');
        handleCloseBorrowalModal();
        clearBorrowForm();
      })
      .catch((error) => {
        console.error('Error adding borrowal:', error);
        toast.error('Failed to add borrowal');
      });
  };

  const fetchGenres = () => {
    axios
      .get(apiUrl(routes.GENRE, methods.GET_ALL))
      .then((response) => {
        setGenres(response.data.genresList);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        toast.error('Failed to fetch genres');
      });
  };

  const fetchAuthors = () => {
    axios
      .get(apiUrl(routes.AUTHOR, methods.GET_ALL))
      .then((response) => {
        setAuthors(response.data.authorsList);
      })
      .catch((error) => {
        console.error('Error fetching authors:', error);
        toast.error('Failed to fetch authors');
      });
  };

  useEffect(() => {
    fetchGenres();
    fetchAuthors();
  }, []);

  const getSelectedBookDetails = () => {
    const selectedBook = books.find((element) => element._id === selectedBookId);
    setBook(selectedBook);
  };

  const clearForm = () => {
    setBook({
      id: '',
      name: '',
      isbn: '',
      summary: '',
      isAvailable: true,
      authorId: '',
      genreId: '',
      photoUrl: '',
      pageUrls: [],
      position: '',
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenBorrowalModal = () => {
    setIsBorrowalModalOpen(true);
  };

  const handleCloseBorrowalModal = () => {
    setIsBorrowalModalOpen(false);
  };

  const clearBorrowForm = () => {
    setBorrowal({
      bookId: '',
      memberId: '',
      borrowedDate: '',
      dueDate: '',
      status: '',
    });
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  useEffect(() => {
    if (filterName.trim() === '' && filterGenre === '' && filterAuthor === '' && filterIsAvailable === '') {
      setFilteredBooks(books);
    } else {
      let filteredResults = books;

      if (filterName.trim() !== '') {
        filteredResults = filteredResults.filter((book) =>
          book.name.toLowerCase().includes(filterName.trim().toLowerCase())
        );
      }

      if (filterGenre !== '') {
        filteredResults = filteredResults.filter((book) => book.genreId === filterGenre);
      }

      if (filterAuthor !== '') {
        filteredResults = filteredResults.filter((book) => book.authorId === filterAuthor);
      }

      if (filterIsAvailable !== '') {
        const isAvailableValue = filterIsAvailable === 'true';
        filteredResults = filteredResults.filter((book) => book.isAvailable === isAvailableValue);
      }

      setFilteredBooks(filteredResults);
    }
  }, [filterName, filterGenre, filterAuthor, filterIsAvailable, books]);

  console.log(user.isAdmin);
  return (
    <>
      <Helmet>
        <title>Books</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" sx={{ mb: 5 }}>
            Books
          </Typography>
          {(user.isAdmin || user.isLibrarian) && (
            <Button
              variant="contained"
              onClick={() => {
                setIsUpdateForm(false);
                handleOpenModal();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Book
            </Button>
          )}
        </Stack>

        <Box mb={3}>
          <OutlinedInput
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Search books..."
            fullWidth
            startAdornment={<Iconify icon="eva:search-outline" color="action" />}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <Select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            fullWidth
            displayEmpty
            input={<OutlinedInput />}
            placeholder="Filter by Genre"
          >
            <MenuItem value="">All Genres</MenuItem>
            {/* Populate genres dynamically */}
            {genres.map((genre) => (
              <MenuItem key={genre._id} value={genre._id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            fullWidth
            displayEmpty
            input={<OutlinedInput />}
            placeholder="Filter by Author"
          >
            <MenuItem value="">All Authors</MenuItem>
            {authors.map((author) => (
              <MenuItem key={author._id} value={author._id}>
                {author.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={filterIsAvailable}
            onChange={(e) => setFilterIsAvailable(e.target.value)}
            fullWidth
            displayEmpty
            input={<OutlinedInput />}
            placeholder="Filter by Availability"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Not Available</MenuItem>
          </Select>
        </Box>

        {isTableLoading ? (
          <Grid padding={2} style={{ textAlign: 'center' }}>
            <CircularProgress />
          </Grid>
        ) : filteredBooks.length > 0 ? (
          <Grid container spacing={4}>
            {filteredBooks.map((book) => (
              <Grid key={book._id} item xs={12} sm={6} md={4}>
                <Card>
                  <Box sx={{ pt: '80%', position: 'relative' }}>
                    <Label
                      variant="filled"
                      sx={{
                        zIndex: 9,
                        top: 16,
                        left: 16,
                        position: 'absolute',
                        textTransform: 'uppercase',
                        color: 'primary.main',
                      }}
                    >
                      {book.genre.name}
                    </Label>
                    {(user.isAdmin || user.isLibrarian) && (
                      <Label
                        variant="filled"
                        sx={{
                          zIndex: 9,
                          top: 12,
                          right: 16,
                          position: 'absolute',
                          borderRadius: '100%',
                          width: '30px',
                          height: '30px',
                          color: 'white',
                          backgroundColor: 'white',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            setSelectedBookId(book._id);
                            handleOpenMenu(e);
                          }}
                        >
                          <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                      </Label>
                    )}

                    <StyledBookImage alt={book.name} src={book.photoUrl} />
                  </Box>

                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Typography textAlign="center" variant="h5" noWrap>
                        {book.name}
                      </Typography>
                    </Link>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: '#888888' }}
                      paddingBottom={1}
                      noWrap
                      textAlign="center"
                    >
                      {book.author.name}
                    </Typography>
                    <Label color={book.isAvailable ? 'success' : 'error'} sx={{ padding: 2 }}>
                      {book.isAvailable ? 'Available' : 'Not available'}
                    </Label>

                    <Typography variant="subtitle2" textAlign="center" paddingTop={1}>
                      ISBN: {book.isbn}
                    </Typography>
                    <TruncatedTypography variant="body2">{book.summary}</TruncatedTypography>


                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="warning" color="warning">
            No books found
          </Alert>
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
        {(user.isAdmin || user.isLibrarian) && (
          <MenuItem
            onClick={() => {
              setIsUpdateForm(true);
              getSelectedBookDetails();
              handleCloseMenu();
              handleOpenModal();
            }}
          >
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        )}

        {(user.isAdmin || user.isLibrarian) && (
          <MenuItem sx={{ color: 'error.main' }} onClick={handleOpenDialog}>
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
      </Popover>
      
      {user && (user.isAdmin || user.isLibrarian) ? (
        <BorrowalForm
          isModalOpen={isBorrowalModalOpen}
          handleCloseModal={handleCloseBorrowalModal}
          id={selectedBookId}
          borrowal={borrowal}
          setBorrowal={setBorrowal}
          handleAddBorrowal={addBorrowal}
        />
      ) : (
        <BorrowalFormForUser
          isModalOpen={isBorrowalModalOpen}
          handleCloseModal={handleCloseBorrowalModal}
          id={selectedBookId}
          borrowal={borrowal}
          setBorrowal={setBorrowal}
          handleAddBorrowal={addBorrowal}
        />
      )}

      <BookDialog
        isDialogOpen={isDialogOpen}
        bookId={selectedBookId}
        handleDeleteBook={deleteBook}
        handleCloseDialog={handleCloseDialog}
      />

      <BookForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedBookId}
        book={book}
        setBook={setBook}
        handleAddBook={addBook}
        handleUpdateBook={updateBook}
      />
    </>
  );
};

export default BookPage;
