import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "GoreMade CRM Dashboard",
  description: "Trainer acquisition and client management dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">
        {children}
      </body>
    </html>
  )
}
