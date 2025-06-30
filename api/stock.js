const { restClient } = require('@polygon.io/client-js');

export default async function handler(req, res) {
  try {
    const ticker = req.query.ticker?.toUpperCase();
    if (!ticker) {
      return res.status(400).json({ error: 'Missing ticker parameter' });
    }

    const apiKey = process.env.POLYGON_API_KEY;
    if (!apiKey) {
      console.error('POLYGON_API_KEY is undefined');
      return res.status(500).json({ error: 'Server misconfiguration: API key missing' });
    }

    const rest = restClient(apiKey);
    const data = await rest.stocks.aggregates(
      ticker,
      1,
      'day',
      '2025-01-01',
      '2025-05-11'
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('API call failed:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
