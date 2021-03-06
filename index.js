// Source: https://hackmd.io/@Heidi-Liu/note-be201-express-node#%E5%9C%A8-Nodejs-%E4%B8%8A%E5%AF%A6%E4%BD%9C-MVC-%E6%9E%B6%E6%A7%8B
// Start with "nodemon index.js"

const port = 5002;
const express = require('express');
const app = express();
const db = require('./db');
const tagController = require('./controllers/tag');
const config = require('./config');

// Middleware
app.use(express.urlencoded({ extender: true }));

app.use(express.static('public'));
app.use('/fs',express.static(config.path));

app.set('view engine', 'ejs');

app.post('/', tagController.add);
app.post('/addTagRes', tagController.addTagsRes);

app.get('/', tagController.index);
app.get('/addTag/:id', tagController.addTags);
app.get('/child/:id', tagController.getChildTags);
app.get('/tree', tagController.getTree);
app.get('/tags', tagController.getAll);
app.get('/tags/:id', tagController.get);

app.listen(port, () => {
  db.connect();
  console.log(`Example app listening at http://localhost:${port}`);
});
