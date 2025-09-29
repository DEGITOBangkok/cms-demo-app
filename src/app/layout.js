
import { routing } from "../../i18n/routing";
import "./globals.css";
import "./ck-editor.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_PATH || 'http://localhost:3000'),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
  return (
    <html lang="en">
      <body className="font-fciconic">
        {children}
      </body>
    </html>
  );
}
