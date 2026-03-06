import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { SpaziPage } from '@/pages/SpaziPage'
import { SpazioDetailPage } from '@/pages/SpazioDetailPage'
import { CalendarioPage } from '@/pages/CalendarioPage'
import { ReportPage } from '@/pages/ReportPage'
import { ImpostazioniPage } from '@/pages/ImpostazioniPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="spazi" element={<SpaziPage />} />
          <Route path="spazi/:spazioId" element={<SpazioDetailPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="impostazioni" element={<ImpostazioniPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
