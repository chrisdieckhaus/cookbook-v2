const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send('Hello, Cookbook-v2!'));

app.listen(port, () => console.log(`Cookbook listening on port ${port}!`));