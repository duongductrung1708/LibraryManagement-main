const backendApiUrl = "http://localhost:8080/api";

const routes = {
  AUTHOR: "author",
  AUTH: "auth",
  BOOK: "book",
  REVIEW: "review",
  BORROWAL: "borrowal",
  GENRE: "genre",
  USER: "user",
  BOOKS_BY_GENRE: 'book/genre',
  BOOKS_BY_AUTHOR: 'book/author',
};

const methods = {
  GET: "get",
  GET_ALL: "getAll",
  POST: "add",
  PUT: "update",
  DELETE: "delete",
  UPLOAD: "upload",
  IMPORT: "import",
};

const apiUrl = (route, method, id = "") => `${backendApiUrl}/${route}/${method}${id && `/${id}`}`;

module.exports = { routes, methods, apiUrl };
