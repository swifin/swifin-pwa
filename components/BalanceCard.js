// components/BalanceCard.js
export default function BalanceCard({ label, value }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
