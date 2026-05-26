import '@/index.css';
import '@/App.css';
import { AuthProvider } from '@/context/AuthContext';
import EmailVerificationOverlay from '@/components/EmailVerificationOverlay';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'NyayaSetu',
  description: 'AI-powered legal services and access-to-justice platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <EmailVerificationOverlay />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
