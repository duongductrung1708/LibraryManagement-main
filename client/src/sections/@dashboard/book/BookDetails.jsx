import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { apiUrl, routes, methods } from '../../../constants';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify'; // Assuming you reuse the styled component from BookPage

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
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getBook = useCallback(() => {
    setIsLoading(true);
    axios
      .get(apiUrl(routes.BOOK, `${methods.GET}/${id}`), { withCredentials: true })
      .then((response) => {
        setBook(response.data.book);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getBook();
  }, [getBook]);

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!book) {
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

      <Box mb={5}>
        <Typography variant="h3">{book.name}</Typography>
        <Typography variant="subtitle1" sx={{ color: '#888888' }}>
          {book.author.name}
        </Typography>
        <Label color={book.isAvailable ? 'success' : 'error'} sx={{ mt: 1, mb: 2 }}>
          {book.isAvailable ? 'Available' : 'Not available'}
        </Label>
      </Box>

      <Box sx={{ position: 'relative', mb: 2 }}>
        <TruncatedTypography variant="body1">{book.summary}</TruncatedTypography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="contained" color="primary">
          Borrow
        </Button>
        <Button variant="outlined" color="primary">
          Back to Books
        </Button>
      </Box>
    </Container>
  );
};

export default BookDetails;
