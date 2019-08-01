const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use((req, res) => {
    res.send('Hello, World!!');
});

const port = 8000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});