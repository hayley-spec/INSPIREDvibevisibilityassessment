import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'Visibility Assessment | Inspired Vibe',
  description: 'Discover your Authority Score and how much buyer trust your expertise builds before the sales call.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
