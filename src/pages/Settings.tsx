import { Header } from '@/components/layout/Header'

export default function Settings() {
  return (
    <>
      <Header title="Configurações" subtitle="Preferências da plataforma" />
      <div className="p-8">
        <div className="flex items-center justify-center h-[400px] rounded-xl border border-dashed border-jinbe-border text-jinbe-muted">
          Settings — Em desenvolvimento
        </div>
      </div>
    </>
  )
}
