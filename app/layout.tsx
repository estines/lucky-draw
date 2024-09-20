import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
})
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
})
const lotusSHLMedium = localFont({
    src: './fonts/LotussSmartHL-Medium.ttf',
    variable: '--font-lotus-med',
    weight: '100 900',
})
const lotusSHLBold = localFont({
    src: './fonts/LotussSmartHL-Bold.ttf',
    variable: '--font-lotus-bold',
    weight: '100 900',
})
const lotusSHLExtraBold = localFont({
    src: './fonts/LotussSmartHL-ExtraBold.ttf',
    variable: '--font-lotus-exbold',
    weight: '100 900',
})

export const metadata: Metadata = {
    title: 'Lucky Draw - Nopicts',
    description: 'random who win the prize.',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${lotusSHLMedium.variable} ${lotusSHLBold.variable} ${lotusSHLExtraBold.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    )
}
