import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Operations from '@/pages/Operations'
import NewOperation from '@/pages/NewOperation'
import Clients from '@/pages/Clients'
import ClientForm from '@/pages/ClientForm'
import ClientDetail from '@/pages/ClientDetail'
import Customers from '@/pages/Customers'
import CustomerForm from '@/pages/CustomerForm'
import CustomerDetail from '@/pages/CustomerDetail'
import Beneficiaries from '@/pages/Beneficiaries'
import BeneficiaryForm from '@/pages/BeneficiaryForm'
import OperationReceipt from '@/pages/OperationReceipt'
import OperationProgress from '@/pages/OperationProgress'
import NewOperationSelect from '@/pages/NewOperationSelect'
import NewReceivable from '@/pages/NewReceivable'
import ReceivableConversion from '@/pages/ReceivableConversion'
import ReceivableDivergence from '@/pages/ReceivableDivergence'
import CounterpartyAnalysis from '@/pages/CounterpartyAnalysis'
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
import OnboardingStatus from '@/pages/onboarding/OnboardingStatus'

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
        <Route path="/onboarding/status" element={<OnboardingStatus />} />

        {/* Main app routes */}
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="operations" element={<Operations />} />
          <Route path="operations/new" element={<NewOperationSelect />} />
          <Route path="operations/new/send" element={<NewOperation />} />
          <Route path="operations/new/receivable" element={<NewReceivable />} />
          <Route path="operations/:id/receipt" element={<OperationReceipt />} />
          <Route path="operations/:id/progress" element={<OperationProgress />} />
          <Route path="receivables/:id/convert" element={<ReceivableConversion />} />
          <Route path="receivables/:id/divergence" element={<ReceivableDivergence />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="beneficiaries" element={<Beneficiaries />} />
          <Route path="beneficiaries/new" element={<BeneficiaryForm />} />
          <Route path="counterparties/:id" element={<CounterpartyAnalysis />} />
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
