import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { JobProvider } from './context/JobContext.jsx'
import { InteractionProvider } from './context/InteractionContext.jsx';
import { TouristProvider } from './context/TouristContext.jsx'
import { MbtiProvider } from './context/MbtiContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <TouristProvider>
            <InteractionProvider>
              <MbtiProvider>
                <App />
              </MbtiProvider>
            </InteractionProvider>
          </TouristProvider>
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
