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



app.get('/', (req, res) => {
    res.send('BulkEmailSender');
});

app.use('/api/user', User);
app.use('/api/plan', Plan);
app.use('/api/payment', Payment);

app.get('/thankyou-unsubscribe', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Unsubscribing</title>
          <style>
              body {
                  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
                  font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
              }
              .container {
                  background: #fff;
                  border-radius: 16px;
                  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                  padding: 48px 32px;
                  max-width: 400px;
                  text-align: center;
              }
              .icon {
                  font-size: 56px;
                  color: #4f8a8b;
                  margin-bottom: 16px;
              }
              h1 {
                  color: #22223b;
                  margin-bottom: 12px;
                  font-size: 2rem;
              }
              p {
                  color: #4a4e69;
                  font-size: 1.1rem;
                  margin-bottom: 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="icon">&#128075;</div>
              <h1>Thank You for Unsubscribing</h1>
              <p>You have been successfully removed from our mailing list.<br>
              From now on, you will not receive any more emails from us.</p>
          </div>
      </body>
      </html>
    `);
});



// Export for Vercel
module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 5010;
    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
}

