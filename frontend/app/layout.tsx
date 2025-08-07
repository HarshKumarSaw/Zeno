// /app/layout.tsx
import '../styles/globals.css';

export const metadata = {
  title: 'Zeno Timeline',
  description: '24-hour mobile timeline app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-gray-900 dark:bg-black dark:text-white">
        {children}
      </body>
    </html>
  );
}
