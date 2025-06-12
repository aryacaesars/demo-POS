import "./globals.css"
import { DataProvider } from "@/lib/data-context"

export const metadata = {
  title: "POS Dashboard",
  description: "Modern Point of Sale System",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  )
}
