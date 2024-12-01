const express = require('express');
const { engine } = require('express-handlebars');  // Correct way to import express-handlebars
const path = require('path');

const app = express();
const port = 3000;

// Set up Handlebars as the templating engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// Set up static files (CSS, JS, images) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', (req, res) => {
  res.render('home');  // This will render "home.hbs" from the views folder
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
