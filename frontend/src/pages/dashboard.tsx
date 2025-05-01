import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    fetch('http://localhost:4000/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!data.email) return router.push('/login');
        setEmail(data.email);
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-3xl font-bold mb-2">Welcome to Dashboard</h1>
      <p className="text-lg">Logged in as: {email}</p>
    </main>
  );
}
