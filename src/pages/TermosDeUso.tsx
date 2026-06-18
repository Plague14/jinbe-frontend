import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import logoJinbe from '@/assets/logo-jinbe.png'

export default function TermosDeUso() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Termos de Uso</h1>
        <p className="text-gray-500 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* 1. Aceitação dos Termos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-400 leading-relaxed">
              Ao acessar e utilizar a plataforma Jinbe ("Plataforma"), você declara ter lido, compreendido e concordado
              com estes Termos de Uso ("Termos"). Se você não concordar com qualquer parte destes Termos, não utilize
              nossos serviços.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              A Jinbe reserva-se o direito de modificar estes Termos a qualquer momento, sendo que as alterações
              entrarão em vigor imediatamente após sua publicação na Plataforma. O uso continuado dos serviços após
              tais modificações constituirá sua aceitação dos novos Termos.
            </p>
          </section>

          {/* 2. Descrição dos Serviços */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Descrição dos Serviços</h2>
            <p className="text-gray-400 leading-relaxed">
              A Jinbe é uma plataforma de tecnologia que facilita operações de câmbio e transferências internacionais
              para pessoas jurídicas. Nossos serviços incluem:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Envio de pagamentos internacionais</li>
              <li>Recebimento de valores do exterior</li>
              <li>Conversão de moedas</li>
              <li>Gestão de beneficiários internacionais</li>
              <li>Relatórios e acompanhamento de operações</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              As operações de câmbio são realizadas por instituições financeiras parceiras devidamente autorizadas
              pelo Banco Central do Brasil.
            </p>
          </section>

          {/* 3. Cadastro e Conta */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Cadastro e Conta</h2>
            <p className="text-gray-400 leading-relaxed">
              Para utilizar a Plataforma, você deve:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Ser pessoa jurídica legalmente constituída no Brasil</li>
              <li>Fornecer informações verdadeiras, precisas e completas durante o cadastro</li>
              <li>Manter suas informações atualizadas</li>
              <li>Ser responsável pela segurança de suas credenciais de acesso</li>
              <li>Notificar imediatamente a Jinbe sobre qualquer uso não autorizado de sua conta</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              A Jinbe realiza verificações de KYB (Know Your Business) e KYC (Know Your Customer) conforme
              exigências regulatórias, podendo solicitar documentos adicionais a qualquer momento.
            </p>
          </section>

          {/* 4. Obrigações do Usuário */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Obrigações do Usuário</h2>
            <p className="text-gray-400 leading-relaxed">
              Ao utilizar a Plataforma, você concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Utilizar os serviços apenas para fins lícitos</li>
              <li>Não realizar operações com recursos de origem ilícita</li>
              <li>Cumprir todas as leis e regulamentações aplicáveis</li>
              <li>Não tentar acessar sistemas ou dados não autorizados</li>
              <li>Não interferir no funcionamento da Plataforma</li>
              <li>Fornecer documentação quando solicitado</li>
            </ul>
          </section>

          {/* 5. Taxas e Pagamentos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Taxas e Pagamentos</h2>
            <p className="text-gray-400 leading-relaxed">
              A Jinbe cobra taxas pelos serviços prestados, que serão informadas antes da confirmação de cada
              operação. As taxas podem incluir:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Spread cambial sobre a taxa de câmbio</li>
              <li>Tarifas de transferência</li>
              <li>IOF (Imposto sobre Operações Financeiras) quando aplicável</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Não há cobrança de mensalidade ou taxa de manutenção de conta. Você paga apenas quando utilizar
              os serviços.
            </p>
          </section>

          {/* 6. Limitação de Responsabilidade */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Limitação de Responsabilidade</h2>
            <p className="text-gray-400 leading-relaxed">
              A Jinbe não será responsável por:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Danos decorrentes de uso indevido da Plataforma pelo usuário</li>
              <li>Atrasos causados por instituições financeiras terceiras</li>
              <li>Variações cambiais após a confirmação da operação</li>
              <li>Indisponibilidade temporária dos serviços por manutenção</li>
              <li>Danos decorrentes de caso fortuito ou força maior</li>
            </ul>
          </section>

          {/* 7. Propriedade Intelectual */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Propriedade Intelectual</h2>
            <p className="text-gray-400 leading-relaxed">
              Todos os direitos de propriedade intelectual relacionados à Plataforma, incluindo mas não limitado
              a marcas, logos, design, textos e software, pertencem exclusivamente à Jinbe ou seus licenciadores.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              É vedada a reprodução, distribuição ou modificação de qualquer conteúdo da Plataforma sem
              autorização prévia por escrito.
            </p>
          </section>

          {/* 8. Encerramento */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Encerramento</h2>
            <p className="text-gray-400 leading-relaxed">
              A Jinbe pode suspender ou encerrar sua conta a qualquer momento, sem aviso prévio, em caso de:
            </p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
              <li>Violação destes Termos</li>
              <li>Suspeita de fraude ou atividade ilícita</li>
              <li>Determinação de autoridades competentes</li>
              <li>Inatividade prolongada</li>
            </ul>
            <p className="text-gray-400 leading-relaxed mt-4">
              Você pode solicitar o encerramento de sua conta a qualquer momento, desde que não haja operações
              pendentes.
            </p>
          </section>

          {/* 9. Legislação Aplicável */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Legislação Aplicável</h2>
            <p className="text-gray-400 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será
              resolvida no foro da Comarca do Rio de Janeiro, Estado do Rio de Janeiro, com exclusão de qualquer outro,
              por mais privilegiado que seja.
            </p>
          </section>

          {/* 10. Contato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Contato</h2>
            <p className="text-gray-400 leading-relaxed">
              Para dúvidas sobre estes Termos de Uso, entre em contato:
            </p>
            <ul className="text-gray-400 mt-4 space-y-2">
              <li><strong className="text-white">E-mail:</strong> juridico@jinbe.com.br</li>
              <li><strong className="text-white">Endereço:</strong> Rio de Janeiro, RJ - Brasil</li>
            </ul>
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
