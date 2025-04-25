// components/ActionButton.js
import Link from 'next/link';

export default function ActionButton({ label, href }) {
  return (
    <Link href={href}>
      <a className="block bg-blue-600 text-white text-center rounded-lg py-3 font-medium hover:bg-blue-700 transition duration-150">
        {label}
      </a>
    </Link>
  );
}
