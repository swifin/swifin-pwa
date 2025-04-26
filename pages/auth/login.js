import { useState } from 'react';

export default function LoginPage() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swifinId, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login success:', data);
      // Redirect or show activation page
    } else {
      console.error('Login failed');
      alert('Login failed. Please check your Swifin ID and Password.');
    }
  };

  return (
    <div>
      <h1>Login to Swifin</h1>
      <form onSubmit={(e) => { e.preventDefault(); login(); }}>
        <input
          type="text"
          placeholder="Swifin ID"
          value={swifinId}
          onChange={(e) => setSwifinId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

