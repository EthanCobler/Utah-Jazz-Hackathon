import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ThemeProvider } from "@/lib/ThemeProvider";
import { AuthProvider } from "@/lib/AuthProvider";


export const metadata: Metadata = {
 title: "Jazz Game-Day Hub",
 description: "Your real-time Utah Jazz fan engagement platform",
};


export const viewport: Viewport = {
 width: "device-width",
 initialScale: 1,
 maximumScale: 1,
 themeColor: "#6B3FA0",
};


export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
   <html lang="en" suppressHydrationWarning>
     <head>
       <link
         href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
         rel="stylesheet"
       />
       <script
         dangerouslySetInnerHTML={{
           __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t==null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
         }}
       />
     </head>
     <body className="min-h-screen bg-bg dark:bg-dark-bg dark:text-dark-text-primary">
       <ThemeProvider>
         <AuthProvider>
           <main className="w-full max-w-screen-xl px-4 mx-auto pb-20 sm:px-6 lg:px-8">{children}</main>
           <BottomNav />
         </AuthProvider>
       </ThemeProvider>
     </body>
   </html>
 );
}
