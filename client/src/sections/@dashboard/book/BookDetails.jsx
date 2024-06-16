import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Grid, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { apiUrl, routes, methods } from '../../../constants';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify'; // Assuming you reuse the styled component from BookPage
import BorrowalForm from '../borrowal/BorrowalForm';

// ----------------------------------------------------------------------

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

const BookDetails = () => {
    const [borrowal, setBorrowal] = useState({
        bookId: '',
        memberId: '',
        borrowedDate: '',
        dueDate: '',
        status: '',
      });

  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState(null);
  const [genre, setGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowalModalOpen, setIsBorrowalModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const getBook = useCallback(() => {
    setIsLoading(true);
    axios
      .get(apiUrl(routes.BOOK, methods.GET, id), { withCredentials: true })
      .then((response) => {
        const bookData = response.data.book;
        setBook(bookData);
        return Promise.all([
          axios.get(apiUrl(routes.AUTHOR, methods.GET, bookData.authorId), { withCredentials: true }),
          axios.get(apiUrl(routes.GENRE, methods.GET, bookData.genreId), { withCredentials: true }),
        ]);
      })
      .then(([authorResponse, genreResponse]) => {
        setAuthor(authorResponse.data.author);
        setGenre(genreResponse.data.genre);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book details:', error);
        toast.error('Failed to fetch book details');
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getBook();
  }, [getBook]);

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

  const backToBookPage = () => {
    navigate('/books');
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

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!book || !author || !genre) {
    return (
      <Container>
        <Typography variant="h5">Book not found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>{book.name} - Book Details</title>
      </Helmet>

      <Button variant="outlined" color="primary" onClick={backToBookPage} sx={{ mb: 2 }}>
        Back to Books
      </Button>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <img alt={book.name} src={book.photoUrl} style={{ width: '100%', height: 'auto' }} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box>
            <Typography variant="h3">{book.name}</Typography>
            <Label color={book.isAvailable ? 'success' : 'error'} sx={{ mt: 1, mb: 2 }}>
              {book.isAvailable ? 'Available' : 'Not available'}
            </Label>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2, display: "flex", alignItems: "center" }}>
              <Avatar alt={author.name} src={author.photoUrl} /> {author.name}
            </Typography>
            <Box sx={{ position: 'relative', mt: 2 }}>
              <TruncatedTypography variant="body1">{book.summary}</TruncatedTypography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2 }}>
              Isbn: {book.isbn}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#888888', mt: 2 }}>
              Genre: {genre.name}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={(e) => {
                          setSelectedBookId(book._id);
                          handleOpenBorrowalModal(e);
                        }}>
              Borrow
            </Button>
          </Box>
        </Grid>
      </Grid>
      <BorrowalForm
        isModalOpen={isBorrowalModalOpen}
        handleCloseModal={handleCloseBorrowalModal}
        id={selectedBookId}
        borrowal={borrowal}
        setBorrowal={setBorrowal}
        handleAddBorrowal={addBorrowal}
      />
    </Container>
  );
};

export default BookDetails;
