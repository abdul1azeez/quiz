import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ScrollProvider } from './context/ScrollContext';
import { cognitoAuthConfig } from "./aws-oidc-config";
import { AuthProvider } from 'react-oidc-context';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScrollProvider>
      <AuthProvider {...cognitoAuthConfig}
        onSigninCallback={() => {
          // This removes the ?code=...&state=... from the URL
          window.history.replaceState({}, document.title, "/");
        }}
      >
        <App />
      </AuthProvider>
    </ScrollProvider>
  </StrictMode>,
)
