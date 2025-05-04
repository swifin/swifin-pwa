// apps/frontend/app/layout.tsx
import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'Swifin App',
  description: 'Inclusive Prosperity With Financial and Economic Inclusion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-5xl mx-auto text-lg font-bold">Swifin Wallet Portal</div>
        </header>
        <main className="max-w-3xl mx-auto p-4">{children}</main>
        <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-500">
          © {new Date().getFullYear()} Swifin. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

