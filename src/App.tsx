import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Operations from '@/pages/Operations'
import NewOperation from '@/pages/NewOperation'
import Clients from '@/pages/Clients'
import ClientForm from '@/pages/ClientForm'
import Customers from '@/pages/Customers'
import CustomerForm from '@/pages/CustomerForm'
import Beneficiaries from '@/pages/Beneficiaries'
import BeneficiaryForm from '@/pages/BeneficiaryForm'
import Webhooks from '@/pages/Webhooks'
import Metrics from '@/pages/Metrics'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import AdminPanel from '@/pages/AdminPanel'

// Landing page
import LandingPage from '@/pages/LandingPage'
import TermosDeUso from '@/pages/TermosDeUso'
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade'

// Onboarding pages
import Login from '@/pages/onboarding/Login'
import Onboarding from '@/pages/onboarding/Onboarding'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page (public) */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/termos" element={<TermosDeUso />} />
        <Route path="/privacidade" element={<PoliticaPrivacidade />} />

        {/* Onboarding flow (outside of AppLayout) */}
        <Route path="/onboarding/login" element={<Login />} />
        <Route path="/onboarding/register" element={<Onboarding />} />

        {/* Main app routes */}
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="operations" element={<Operations />} />
          <Route path="operations/new" element={<NewOperation />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="beneficiaries" element={<Beneficiaries />} />
          <Route path="beneficiaries/new" element={<BeneficiaryForm />} />
          <Route path="webhooks" element={<Webhooks />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
