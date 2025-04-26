// pages/api/payments/create-payment.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, paymentMethod } = req.body;

  if (!amount || !paymentMethod) {
    return res.status(400).json({ error: 'Amount and payment method are required.' });
  }

  try {
    let paymentUrl = '';

    if (paymentMethod === 'stripe') {
      // STRIPE PAYMENT
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Buy SFNC',
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel`,
      });

      paymentUrl = session.url;
    }

    else if (paymentMethod === 'flutterwave') {
      // FLUTTERWAVE PAYMENT
      const response = await axios.post('https://api.flutterwave.com/v3/payments', {
        tx_ref: `SFNC_${Date.now()}`,
        amount,
        currency: 'USD',
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
        customer: {
          email: 'user@example.com', // Ideally pull from user profile
          phonenumber: '0000000000',
          name: 'SFNC Buyer'
        },
        customizations: {
          title: 'Buy SFNC',
          description: 'Swifin SFNC Purchase',
        }
      }, {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        }
      });

      paymentUrl = response.data.data.link;
    }

    else if (paymentMethod === 'paypal') {
      // PAYPAL PAYMENT
      const baseUrl = 'https://api-m.sandbox.paypal.com'; // use live URL in production
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');

      const tokenRes = await axios.post(`${baseUrl}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      const accessToken = tokenRes.data.access_token;

      const orderRes = await axios.post(`${baseUrl}/v2/checkout/orders`, {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: amount,
          },
          description: 'Buy SFNC',
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel`,
        },
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      const approveUrl = orderRes.data.links.find(link => link.rel === 'approve');
      paymentUrl = approveUrl.href;
    }

    else if (paymentMethod === 'coinbase') {
      // COINBASE COMMERCE PAYMENT
      const response = await axios.post('https://api.commerce.coinbase.com/charges', {
        name: 'Buy SFNC',
        description: 'Swifin SFNC Purchase',
        pricing_type: 'fixed_price',
        local_price: {
          amount,
          currency: 'USD',
        },
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-cancel`,
      }, {
        headers: {
          'X-CC-Api-Key': process.env.COINBASE_API_KEY,
          'X-CC-Version': '2018-03-22',
        }
      });

      paymentUrl = response.data.data.hosted_url;
    }

    else if (paymentMethod === 'coinpayments') {
      // COINPAYMENTS PAYMENT (simplified, real-world would require full flow)
      const payload = new URLSearchParams();
      payload.append('key', process.env.COINPAYMENTS_PUBLIC_KEY);
      payload.append('version', '1');
      payload.append('cmd', 'create_transaction');
      payload.append('amount', amount);
      payload.append('currency1', 'USD');
      payload.append('currency2', 'BTC'); // Target coin, e.g., Bitcoin
      payload.append('buyer_email', 'user@example.com'); // Optional

      const response = await axios.post('https://www.coinpayments.net/api.php', payload);

      paymentUrl = response.data.result.checkout_url;
    }

    else {
      return res.status(400).json({ error: 'Unsupported payment method.' });
    }

    return res.status(200).json({ paymentUrl });

  } catch (error) {
    console.error('Payment creation error:', error);
    return res.status(500).json({ error: 'Payment creation failed.' });
  }
}
