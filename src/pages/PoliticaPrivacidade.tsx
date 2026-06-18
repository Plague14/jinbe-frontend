import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logoJinbe from '@/assets/logo-jinbe.png'

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/landing" className="flex items-center">
              <img src={logoJinbe} alt="Jinbe" className="h-8" />
            </Link>
            <Link
              to="/landing"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Política de Privacidade</h1>
        <p className="text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Introdução */}
          <section>
            <p className="text-gray-400 leading-relaxed">
              A Jinbe ("nós", "nosso" ou "Jinbe") está comprometida com a proteção da privacidade e dos dados
              pessoais de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos,
              armazenamos e protegemos suas informações quando você utiliza nossa plataforma.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº
              13.709/2018) e demais normas aplicáveis.
            </p>
          </section>

          {/* 1. Dados Coletados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Dados que Coletamos</h2>

            <h3 className="text-lg font-medium text-white mt-6 mb-3">1.1 Dados fornecidos por você</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong className="text-white">Dados cadastrais da empresa:</strong> razão social, CNPJ, endereço, telefone, e-mail</li>
              <li><strong className="text-white">Dados dos representantes legais:</strong> nome completo, CPF, cargo, documentos de identificação</li>
              <li><strong className="text-white">Dados bancários:</strong> informações de contas para operações de câmbio</li>
              <li><strong className="text-white">Dados de beneficiários:</strong> informações de destinatários de transferências internacionais</li>
            </ul>

            <h3 className="text-lg font-medium text-white mt-6 mb-3">1.2 Dados coletados automaticamente</h3>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li><strong className="text-white">Dados de navegação:</strong> endereço IP, tipo de navegador, páginas acessadas</li>
              <li><strong className="text-white">Dados de dispositivo:</strong> modelo, sistema operacional, identificadores únicos</li>
              <li><strong className="text-white">Cookies e tecnologias similares:</strong> para melhorar sua experiência na plataforma</li>
            </ul>
          </section>

          {/* 2. Finalidade do Tratamento */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Como Usamos seus Dados</h2>
            <p className="text-gray-400 leading-relaxed">
              Utilizamos seus dados pessoais para as seguintes finalidades:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Prestação dos serviços de câmbio e transferências internacionais</li>
              <li>Verificação de identidade (KYC/KYB) conforme exigências regulatórias</li>
              <li>Prevenção a fraudes e lavagem de dinheiro</li>
              <li>Cumprimento de obrigações legais e regulatórias</li>
              <li>Comunicação sobre sua conta e operações</li>
              <li>Envio de informações sobre produtos e serviços (com seu consentimento)</li>
              <li>Melhoria contínua de nossos serviços</li>
              <li>Análises estatísticas e pesquisas</li>
            </ul>
          </section>

          {/* 3. Base Legal */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Base Legal para o Tratamento</h2>
            <p className="text-gray-400 leading-relaxed">
              O tratamento de seus dados pessoais é realizado com base nas seguintes hipóteses legais previstas
              na LGPD:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li><strong className="text-white">Execução de contrato:</strong> para prestação dos serviços contratados</li>
              <li><strong className="text-white">Cumprimento de obrigação legal:</strong> para atender exigências do Banco Central e outros órgãos</li>
              <li><strong className="text-white">Legítimo interesse:</strong> para prevenção a fraudes e melhoria dos serviços</li>
              <li><strong className="text-white">Consentimento:</strong> para envio de comunicações de marketing</li>
            </ul>
          </section>

          {/* 4. Compartilhamento de Dados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Compartilhamento de Dados</h2>
            <p className="text-gray-400 leading-relaxed">
              Seus dados podem ser compartilhados com:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li><strong className="text-white">Instituições financeiras parceiras:</strong> para execução das operações de câmbio</li>
              <li><strong className="text-white">Prestadores de serviços:</strong> empresas que nos auxiliam na operação (verificação de identidade, infraestrutura tecnológica)</li>
              <li><strong className="text-white">Autoridades reguladoras:</strong> Banco Central, COAF e outros órgãos, quando exigido por lei</li>
              <li><strong className="text-white">Correspondentes bancários:</strong> para processamento de operações internacionais</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins de marketing.
            </p>
          </section>

          {/* 5. Transferência Internacional */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Transferência Internacional de Dados</h2>
            <p className="text-gray-400 leading-relaxed">
              Devido à natureza de nossos serviços, seus dados podem ser transferidos para outros países para
              processamento de operações internacionais. Nesses casos, garantimos que:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Os países de destino possuem legislação de proteção de dados adequada, ou</li>
              <li>Adotamos cláusulas contratuais padrão para garantir a proteção de seus dados</li>
            </ul>
          </section>

          {/* 6. Segurança dos Dados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Segurança dos Dados</h2>
            <p className="text-gray-400 leading-relaxed">
              Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controle de acesso baseado em funções</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares</li>
              <li>Treinamento de colaboradores sobre proteção de dados</li>
              <li>Auditorias periódicas de segurança</li>
            </ul>
          </section>

          {/* 7. Retenção de Dados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-400 leading-relaxed">
              Mantemos seus dados pessoais pelo tempo necessário para:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Prestação dos serviços contratados</li>
              <li>Cumprimento de obrigações legais (mínimo de 5 anos para operações de câmbio)</li>
              <li>Exercício regular de direitos em processos judiciais ou administrativos</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Após o término do período de retenção, seus dados serão eliminados ou anonimizados.
            </p>
          </section>

          {/* 8. Seus Direitos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Seus Direitos</h2>
            <p className="text-gray-400 leading-relaxed">
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li><strong className="text-white">Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los</li>
              <li><strong className="text-white">Correção:</strong> solicitar a correção de dados incompletos ou desatualizados</li>
              <li><strong className="text-white">Anonimização ou eliminação:</strong> solicitar a anonimização ou exclusão de dados desnecessários</li>
              <li><strong className="text-white">Portabilidade:</strong> receber seus dados em formato estruturado</li>
              <li><strong className="text-white">Informação sobre compartilhamento:</strong> saber com quem compartilhamos seus dados</li>
              <li><strong className="text-white">Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento</li>
              <li><strong className="text-white">Oposição:</strong> opor-se ao tratamento em determinadas situações</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Para exercer seus direitos, entre em contato com nosso Encarregado de Proteção de Dados (DPO)
              pelo e-mail: <a href="mailto:privacidade@jinbe.com.br" className="text-blue-400 hover:underline">privacidade@jinbe.com.br</a>
            </p>
          </section>

          {/* 9. Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Cookies e Tecnologias Similares</h2>
            <p className="text-gray-400 leading-relaxed">
              Utilizamos cookies para:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li><strong className="text-white">Cookies essenciais:</strong> necessários para o funcionamento da plataforma</li>
              <li><strong className="text-white">Cookies de desempenho:</strong> para analisar como você usa a plataforma</li>
              <li><strong className="text-white">Cookies de funcionalidade:</strong> para lembrar suas preferências</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas
              funcionalidades da plataforma.
            </p>
          </section>

          {/* 10. Alterações */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Alterações nesta Política</h2>
            <p className="text-gray-400 leading-relaxed">
              Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos você sobre
              alterações significativas por e-mail ou através de aviso em destaque na plataforma.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Recomendamos que você revise esta política regularmente para se manter informado sobre
              como protegemos suas informações.
            </p>
          </section>

          {/* 11. Contato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Contato</h2>
            <p className="text-gray-400 leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados,
              entre em contato:
            </p>
            <div className="mt-4 p-6 bg-[#161b22] border border-white/10 rounded-xl">
              <h3 className="text-white font-medium mb-3">Encarregado de Proteção de Dados (DPO)</h3>
              <ul className="text-gray-400 space-y-2">
                <li><strong className="text-white">E-mail:</strong> privacidade@jinbe.com.br</li>
                <li><strong className="text-white">Endereço:</strong> Rio de Janeiro, RJ - Brasil</li>
              </ul>
            </div>
            <p className="text-gray-400 leading-relaxed mt-4">
              Você também tem o direito de apresentar reclamação à Autoridade Nacional de Proteção de Dados
              (ANPD) caso entenda que seus direitos não foram atendidos.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Jinbe. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
