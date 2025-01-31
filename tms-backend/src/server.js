const express = require('express');
const app = express();
const metricsMiddleware = require('./metrics');

// Apply metrics middleware
metricsMiddleware(app);

// Other routes and middleware
// ...

app.listen(3000, () => console.log('Server running on port 3000')); 