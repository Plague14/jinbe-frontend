import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Operations from '@/pages/Operations'
import NewOperation from '@/pages/NewOperation'
import Clients from '@/pages/Clients'
import ClientForm from '@/pages/ClientForm'
import Beneficiaries from '@/pages/Beneficiaries'
import BeneficiaryForm from '@/pages/BeneficiaryForm'
import Metrics from '@/pages/Metrics'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="operations" element={<Operations />} />
          <Route path="operations/new" element={<NewOperation />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="beneficiaries" element={<Beneficiaries />} />
          <Route path="beneficiaries/new" element={<BeneficiaryForm />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
