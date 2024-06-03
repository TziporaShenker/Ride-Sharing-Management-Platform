const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// const usersRouter = require("./routes/usersRouter");
// const albumsRouter = require('./routes/albumsRouter');
// const commentsRouter = require('./routes/commentsRouter');
// const photosRouter = require('./routes/photosRouter');
// const postsRouter = require('./routes/postsRouter');
// const todosRouter = require('./routes/todosRouter');
// const passwordRouter = require('./routes/passwordsRouter');
const loginRoute = require('./routes/loginRoute');
// const signupRoute = require('./routes/signupRoute');

const logger = (req, res, next) => {
  const url = req.url;
  const date = new Date();
  const msg = `Date: ${date}, Url:${url} \n`;
  fs.appendFile(path.join(__dirname, 'log.txt'), msg, () => {
    console.log('success!!');
    next();
  });

}
app.use(logger);

// app.use('/albums', albumsRouter);
// app.use('/comments', commentsRouter);
// app.use('/photos', photosRouter);
// app.use('/posts', postsRouter);
// app.use('/todos', todosRouter);
// app.use('/users', usersRouter);
// app.use('/passwords', passwordRouter);
app.use('/login', loginRoute);
// app.use('/signup', signupRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});