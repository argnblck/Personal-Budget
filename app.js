const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, `.${process.env.NODE_ENV}.env`) });
const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server start on ${port} port`);
})
