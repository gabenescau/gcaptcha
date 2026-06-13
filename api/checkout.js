const axios = require('axios');

export default async function handler(req, res) {
  // 1. Configurar CORS (Cross-Origin Resource Sharing)
  // Permitir chamadas do próprio domínio e de localhost (para testes locais)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Lidar com a requisição de pré-vôo (Preflight OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Validar método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { payerName, phone } = req.body;

    // 3. Resgatar variáveis de ambiente da Vercel
    const clientId = process.env.MISTIC_CLIENT_ID;
    const clientSecret = process.env.MISTIC_CLIENT_SECRET;
    const payerDocument = process.env.TEST_PAYER_DOCUMENT;

    if (!clientId || !clientSecret || !payerDocument) {
      return res.status(500).json({ error: 'Erro de Configuração: Variáveis de ambiente faltando na Vercel.' });
    }

    if (!payerName || !phone) {
      return res.status(400).json({ error: 'O Nome e o Telefone são obrigatórios.' });
    }

    const FIXED_AMOUNT = 29.81;

    // 4. Chamar a API da Mistic Pay
    const response = await axios.post(
      'https://api.misticpay.com/api/transactions/create',
      {
        payerName: payerName,
        payerDocument: payerDocument, // O CPF fixo do seu .env
        amount: FIXED_AMOUNT,
        description: 'Pagamento via PIX - Vercel Integration',
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

    const transactionData = response.data;
    
    // 5. Retornar ao Frontend
    return res.status(200).json({
      success: true,
      qrCodeBase64: transactionData.qrCodeBase64 || transactionData.qrcodeBase64 || '',
      copyPaste: transactionData.copyPaste || transactionData.pixCopiaECola || '',
      transactionId: transactionData.transactionId || ''
    });

  } catch (error) {
    console.error('Mistic Pay API Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Falha ao processar pagamento com a Mistic Pay',
      details: error.response?.data || error.message
    });
  }
}
