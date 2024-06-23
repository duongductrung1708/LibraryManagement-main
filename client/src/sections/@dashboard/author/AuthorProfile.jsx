import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Avatar, CircularProgress, Stack, Container, Grid, Card, Button } from '@mui/material';
import { apiUrl, methods, routes } from '../../../constants';

export default function AuthorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
    marginTop: "30rem",
  };

  const getAuthorAndBooks = useCallback(() => {
    setLoading(true);
    axios
      .get(apiUrl(routes.AUTHOR, methods.GET, id), { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.author) {
          setAuthor(response.data.author);
          return axios.get(apiUrl(routes.BOOKS_BY_AUTHOR, methods.GET, id), { withCredentials: true });
        } else {
          throw new Error('Author not found');
        }
      })
      .then((booksResponse) => {
        setBooks(booksResponse.data.books);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching author and books:', error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getAuthorAndBooks();
  }, [getAuthorAndBooks]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!author) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Author not found</Typography>
      </Box>
    );
  }

  const backToBookPage = () => {
    navigate('/books');
  };

  return (
    <Box sx={style}>
      <Button variant="outlined" color="primary" sx={{ mb: 2 }} onClick={backToBookPage}>
        Back to Book
      </Button>
      <Helmet>
        <title>Author Profile - {author.name}</title>
      </Helmet>
      <Container>
        <Stack spacing={3} paddingY={2} alignItems={'center'}>
          <Avatar src={author.photoUrl} alt={author.name} sx={{ width: 100, height: 100 }} />
          <Typography variant="h4" style={{ textAlign: 'center', width: '100%' }}>
            {author.name}
          </Typography>
          <Typography variant="body1" style={{ width: '100%' }}>
            Description: {author.description || 'No description available'}
          </Typography>
          <Typography variant="h6" style={{ width: '100%' }}>
            Books by {author.name}:
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {books.map((book) => (
              <Grid item xs={12} sm={4} key={book._id} style={{ paddingLeft: '3rem' }}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <img alt={book.name} src={book.photoUrl} style={{ width: '100%', height: 'auto' }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2, textAlign: 'center', cursor: 'pointer' }}
                    onClick={() => Navigate(`/books/${book._id}`)}
                  >
                    {book.name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
