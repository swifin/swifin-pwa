import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [swifinId, setSwifinId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://75.119.136.87:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swifinId, password }),
      });

      const data = await response.json();

      if (data.success && data.redirect) {
        router.push(data.redirect); // ✅ dynamically redirect to /dashboard or /register
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>
        )}

        <label className="block mb-2 font-medium">Swifin ID</label>
        <input
          type="text"
          value={swifinId}
          onChange={(e) => setSwifinId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

