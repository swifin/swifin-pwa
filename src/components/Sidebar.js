export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-primary text-white p-6">
      <h2 className="text-xl font-semibold mb-6">Swifin</h2>
      <nav>
        <ul className="space-y-4">
          <li><a href="/" className="hover:underline">Dashboard</a></li>
          <li><a href="/wallet" className="hover:underline">Wallet</a></li>
          <li><a href="/transactions" className="hover:underline">Transactions</a></li>
        </ul>
      </nav>
    </aside>
  );
}