import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Header from '../../src/components/Header/Header'
import Footer from '../../src/components/Footer/Footer'
import './globals.css'
import ThemeProvider from '@/src/components/ThemeProvider/ThemeProvider'
import Auth from '@/app/(web)/auth/page'
import { NextAuthProvider } from '@/src/components/AuthProvider/AuthProvider'
import Toast from '@/src/components/Toast/Toast'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ["400", "500", "700", "900"],
  style: ["italic", "normal"],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Hotel Management System',
  description: 'Discover the best room in Hao\'s hotel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin='anonymous'
        />
      </head>
      <body className={poppins.className}>
        <NextAuthProvider>
          <ThemeProvider>
            <Toast />
            <main className='font-normal'>
              <Header />
              {children}
              <Footer />
            </main>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
