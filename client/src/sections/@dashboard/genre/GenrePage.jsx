import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Alert } from "@mui/lab";
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
  Typography
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import GenreTableHead from "./GenreListHead";
import GenreForm from "./GenreForm";
import GenreDialog from "./GenreDialog";
import { applySortFilter, getComparator } from "../../../utils/tableOperations";
import { useAuth } from "../../../hooks/useAuth";
import { apiUrl, methods, routes } from "../../../constants";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Name", alignRight: false },
  { id: "description", label: "Description", alignRight: false },
  { id: "", label: "", alignRight: false }
];

// ----------------------------------------------------------------------

const GenrePage = () => {
  const { user } = useAuth();

  // State variables
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [genre, setGenre] = useState({ id: "", name: "", description: "" });
  const [genres, setGenres] = useState([]);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdateForm, setIsUpdateForm] = useState(false);

  // Load data on initial page load
  useEffect(() => {
    getAllGenres();
  }, []);

  // API operations
  const getAllGenres = () => {
    axios
      .get(apiUrl(routes.GENRE, methods.GET_ALL))
      .then((response) => {
        setGenres(response.data.genresList);
        setIsTableLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addGenre = () => {
    axios
      .post(apiUrl(routes.GENRE, methods.POST), genre)
      .then((response) => {
        toast.success("Genre added");
        handleCloseModal();
        getAllGenres();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong, please try again");
      });
  };

  const updateGenre = () => {
    axios
      .put(apiUrl(routes.GENRE, methods.PUT, selectedGenreId), genre)
      .then((response) => {
        toast.success("Genre updated");
        handleCloseModal();
        handleCloseMenu();
        getAllGenres();
        clearForm();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong, please try again");
      });
  };

  const deleteGenre = (genreId) => {
    axios
      .delete(apiUrl(routes.GENRE, methods.DELETE, genreId))
      .then((response) => {
        toast.success("Genre deleted");
        handleCloseDialog();
        handleCloseMenu();
        getAllGenres();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong, please try again");
      });
  };

  const getSelectedGenreDetails = () => {
    const selectedGenre = genres.find((element) => element._id === selectedGenreId);
    setGenre(selectedGenre);
  };

  const clearForm = () => {
    setGenre({ id: "", name: "", description: "" });
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

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

  const canManageGenres = user.isAdmin || user.isLibrarian;

  const filteredGenres = applySortFilter(genres, getComparator(order, orderBy), filterName);

  return (
    <>
      <Helmet>
        <title>Genres</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Genres
          </Typography>
          {canManageGenres && (
            <Button
              variant="contained"
              onClick={() => {
                setIsUpdateForm(false);
                handleOpenModal();
              }}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Genre
            </Button>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <OutlinedInput
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Search by name..."
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            sx={{ width: 240 }}
          />
        </Stack>
        {isTableLoading ? (
          <Grid style={{ textAlign: "center" }}>
            <CircularProgress size="lg" />
          </Grid>
        ) : (
          <Card>
            <Scrollbar>
              {filteredGenres.length > 0 ? (
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <GenreTableHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={filteredGenres.length}
                      onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                      {filteredGenres
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { _id, name, description } = row;

                          return (
                            <TableRow hover key={_id} tabIndex={-1}>
                              <TableCell align="left">
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                              </TableCell>

                              <TableCell align="left">{description}</TableCell>

                              <TableCell align="right">
                                {canManageGenres && (
                                  <IconButton
                                    size="large"
                                    color="inherit"
                                    onClick={(e) => {
                                      setSelectedGenreId(_id);
                                      handleOpenMenu(e);
                                    }}
                                  >
                                    <Iconify icon={"eva:more-vertical-fill"} />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="warning" color="warning">
                  No genres found
                </Alert>
              )}
            </Scrollbar>
            {filteredGenres.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredGenres.length}
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
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75
            }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            setIsUpdateForm(true);
            getSelectedGenreDetails();
            handleCloseMenu();
            handleOpenModal();
          }}
        >
          <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }} onClick={handleOpenDialog}>
          <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <GenreForm
        isUpdateForm={isUpdateForm}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        id={selectedGenreId}
        genre={genre}
        setGenre={setGenre}
        handleAddGenre={addGenre}
        handleUpdateGenre={updateGenre}
      />

      <GenreDialog
        isDialogOpen={isDialogOpen}
        genreId={selectedGenreId}
        handleDeleteGenre={deleteGenre}
        handleCloseDialog={handleCloseDialog}
      />
    </>
  );
};

export default GenrePage;
