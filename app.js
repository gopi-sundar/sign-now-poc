const express = require('express');



const app = express();
const port = process.env.PORT || 3000;

// Static content
app.use('/assets', express.static(__dirname + '/public'));

// Root 
app.use('/', (req, res, next) => {
	console.log(`Request Url:${req.url}`);
	res.json({ message: 'Hello from Node Express !' });

	next();
});

app.listen(port);