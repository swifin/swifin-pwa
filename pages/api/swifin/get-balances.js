// pages/api/swifin/get-balances.js

export default async function handler(req, res) {
  try {
    // 🛠️ For now, mock balances
    // Later: replace with real Swifin Core API or Smart Contract balance lookup

    const balances = {
      SFNL: 1000,  // Pretend balance
      SFNC: 500,   // Pretend balance
    };

    return res.status(200).json(balances);
  } catch (error) {
    console.error('Get balance error:', error);
    return res.status(500).json({ error: 'Failed to fetch balances' });
  }
}
