const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, `.${process.env.NODE_ENV}.env`) });
const express = require('express');
const app = express();
const envelopesRouter = require('./routes/envelopes.route');

app.use(express.json());
app.use('api/envelopes', envelopesRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server start on ${port} port`);
})
