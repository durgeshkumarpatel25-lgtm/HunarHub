import './globals.css'

export const metadata = {
  title: 'HunarHub - Local Micro-Entrepreneurs Marketplace',
  description: 'A digital marketplace to discover and support local micro-entrepreneurs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
