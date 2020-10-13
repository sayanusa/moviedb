const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

//middlewares
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/public', express.static('public'));

const router = require('./routes');
const errorHandling = require('./middlewares/errorHandling');

//routes
app.use(router);
app.use(errorHandling);


app.listen(PORT, () => {
    console.log(`Server is running at port : ${PORT}`);
});
