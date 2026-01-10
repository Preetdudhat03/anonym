File: s:\anonym\src\app\layout.js

Overview:
This is the "Root Layout" in Next.js. It wraps EVERY page in the application. It defines the global HTML structure (<html>, <body>) and loads global fonts and styles.

Detailed Line-by-Line Explanation:

1: import { Geist, Geist_Mono } from "next/font/google";
Reason: Import Google Fonts optimized by Next.js. 'Geist' is the chosen font family.

2: import "./globals.css";
Reason: Import the global CSS file. This ensures that basic styles (like dark mode background, reset rules) apply to every page.

4: const geistSans = Geist({
...
10:   variable: "--font-geist-mono",
Reason: Configure the fonts. We set them as "CSS Variables" (--font-geist-sans) so we can easily use them in our CSS files.

14: export const metadata = {
15:   title: "Anonym",
16:   description: "An anonymous, end-to-end encrypted chat...",
17: };
Reason: Define the SEO metadata. 'title' appears in the browser tab. 'description' appears in Google search results.

19: export default function RootLayout({ children }) {
Reason: The main component. '{ children }' represents the content of the page you are currently looking at (e.g., Home or Chat).

21:     <html lang="en">
22:       <body className={`${geistSans.variable} ${geistMono.variable}`}>
Reason: Apply the font variables to the body tag. This makes the fonts available throughout the app.

23:         {children}
Reason: Render the actual page content here.
