import Providers from "./providers"
import "./globals.css"
import '@rainbow-me/rainbowkit/styles.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
  )
}