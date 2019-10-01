const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello, Cookbook!'));

app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));