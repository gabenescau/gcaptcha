require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Fixed Amount defined in the implementation plan
const FIXED_AMOUNT = 29.81;

app.post('/api/checkout', async (req, res) => {
  try {
    const { payerName, phone } = req.body;

    // Load credentials and test document from environment
    const clientId = process.env.MISTIC_CLIENT_ID;
    const clientSecret = process.env.MISTIC_CLIENT_SECRET;
    const payerDocument = process.env.TEST_PAYER_DOCUMENT;

    if (!clientId || !clientSecret || !payerDocument) {
      return res.status(500).json({ error: 'Missing environment configuration' });
    }

    if (!payerName || !phone) {
      return res.status(400).json({ error: 'Name and Phone are required' });
    }

    // Call Mistic Pay API
    const response = await axios.post(
      'https://api.misticpay.com/api/transactions/create',
      {
        payerName: payerName,
        payerDocument: payerDocument, // Using the configured document
        amount: FIXED_AMOUNT, // Using the fixed amount
        description: 'Pagamento via PIX - Mistic Pay Integration MVP',
        transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'ci': clientId,
          'cs': clientSecret
        }
      }
    );

    // Extract relevant data from Mistic Pay response
    // Depending on their API, it might be qrcodeBase64, qrcodeUrl, or copyPaste
    // Using hypothetical fields based on standard PIX gateways
    const transactionData = response.data;
    
    // Send only necessary data to the frontend
    res.json({
      success: true,
      qrCodeBase64: transactionData.qrCodeBase64 || transactionData.qrcodeBase64 || '',
      copyPaste: transactionData.copyPaste || transactionData.pixCopiaECola || '',
      transactionId: transactionData.transactionId || ''
    });

  } catch (error) {
    console.error('Mistic Pay API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to process payment with Mistic Pay',
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
