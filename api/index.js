const express = require('express');
const Crawler = require('crawler');
const app = express();
const cors = require('cors');
const { validate } = require('deep-email-validator');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const morgan = require('morgan');


const User = require('./routes/user');
const Plan = require('./routes/plan');
const Payment = require('./routes/payment');

require('dotenv').config();


// ===DATABASE CONNECTION===
// mongoose.connect('mongodb+srv://doadmin:H14tW07z68T5dym9@smartemailextarctor-0973a08f.mongo.ondigitalocean.com/smartemailextractor?tls=true&authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://doadmin:H14tW07z68T5dym9@smartemailextarctor-0973a08f.mongo.ondigitalocean.com/bulkemailsender?tls=true&authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (err) => {
    console.log('Failed to connect.')
    console.log(err);
});
db.once('open', () => {
    console.log('Successfully Connected.');
})
// ===DATABASE CONNECTION===

// Simple route
app.get("/", (req, res) => {
    res.send({ message: "Hello from Express API on Vercel!" });
});

// Example route
app.get("/api/greet/:name", (req, res) => {
    res.json({ greeting: `Hello, ${req.params.name}!` });
});

// Export for Vercel
module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 5010;
    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
}

