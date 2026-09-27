import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AI Code Reviewer - Free Code Analysis',
  description: 'Analyze your code with AI. Find bugs, security issues, and get improvement suggestions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
