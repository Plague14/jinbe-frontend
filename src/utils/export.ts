/**
 * Utilitário de Exportação de Dados
 * Suporta CSV e Excel (XLS nativo)
 * PDF requer bibliotecas externas - usar CSV/Excel por enquanto
 */

export type ExportFormat = 'csv' | 'excel' | 'pdf'

interface ExportColumn {
  key: string
  header: string
  formatter?: (value: unknown) => string
}

/**
 * Exporta dados para CSV
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  // Cabeçalho
  const headers = columns.map(col => col.header).join(',')

  // Linhas
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key]
      const formatted = col.formatter ? col.formatter(value) : String(value ?? '')
      // Escape aspas e vírgulas
      if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
        return `"${formatted.replace(/"/g, '""')}"`
      }
      return formatted
    }).join(',')
  })

  const csv = [headers, ...rows].join('\n')

  // Download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  downloadBlob(blob, `${filename}.csv`)
}

/**
 * Exporta dados para Excel (formato XLS/HTML que o Excel abre)
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  // Criar tabela HTML que o Excel consegue abrir
  const headers = columns.map(col => `<th style="background:#0d7ff2;color:white;font-weight:bold;padding:8px;border:1px solid #ddd;">${col.header}</th>`).join('')

  const rows = data.map((row, i) => {
    const cells = columns.map(col => {
      const value = row[col.key]
      const formatted = col.formatter ? col.formatter(value) : String(value ?? '')
      const bgColor = i % 2 === 0 ? '#ffffff' : '#f8fafc'
      return `<td style="background:${bgColor};padding:6px;border:1px solid #ddd;">${formatted}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Dados</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <table border="1">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  downloadBlob(blob, `${filename}.xls`)
}

// Logo Jinbe em base64 (branca)
const JINBE_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAAoCAYAAAAqwsWFAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQpSURBVHgB7ZyNcdswDIVfjg6gjuAR0hHqEewR6hHcEZwR4hHsEZwR7BHkEdQRmhFuI4gFiBeSIkXKsaP37k4xyR8R+AiAJDOzAAAAAAAAAAAAAAAAACB8+mcwA6+Zyf1SqPcfxnWO0T0wwB0rk+sM6lXM3HXoIxgAZhJoMqj3Y0r3Y4CWxEq86k3PwJBIrERkIIRPrEQACB9HLHccbIZgsIgVq3r0sJwV+3p7DdmA/qjLuwO2v7P6PMEM6N6K2D3I9ktsJ4E2iXRj/rWf++qWXfB/rNtM6yXlnXqDgQJO8TH23PgS+93n/UH1VwTKcgLx6NMQrVRk+r4KpLfcKGIJEbECb6yI9ZE2eECqnxLrVCR+I2Ids/5n4q1x6aGLWGUk1n8u38dLQGLFIlZi1i/OcIH2SYvECo5YiejA2NX6tQ2fSKRIrJXZfpMhgRbDIlaiW7GSM0WswQEEMiTWSmwnt8MWCRW5wKtdEbHWrKJC4rkRawPiNZJqxQorYk0pYk0bHJGwIlZGBkZCLUWsckOsY7aDA+JNRG3EWjA4ug0iNABirWVkIDSKWMvQIALtRawVG5BYUYhYq9AgAm1GrCMbmFhjRywLxJqEWnMJDYJEJFZyy41Y0wGI9VlDgyAJidWkIlZyxJouOGINJSJWdMRajVjzBkckREKsUKs+1rpkccT6HKFBkIrEiuooYk0bHJGwInafIlZ0xJouOGJNBRCrERoEq0isdYQGwWoSa9ngiIQbsRYNjkhYFWvB4IiEGLFWCQ2CJCRWVMRaJjgiIRJqFaFBsIrEWjY4ImFVrGWDIxJixVomNCJhRazViDU4ImFFrMWINThiYVWsBYMjEqKINWINDoJVJNY6QoNgFYm1jtAgWEViLRsckRAr1mJChyARiRVVsUYHSCRCrLhAaBCsJrHWERoEq0isRYMjEoJYi4QOgkQk1jJCg2A1ibVscERCJMQKCQ2CRCTWakKDYBWJtWhwRMKKWEsGRyREES8kNAhWkVjrCQ2CVSTWusERCZEQKzg0CFaRWOsJDYLVJNaywREJq2ItGhyREAm1gtAgSEVirSY0CFaRWOsIDYJVJNY6QoMgFYm1jtAgWE1irSc0CFaRWIsGRyREQq2g0CBIRGKtJjQIVpFYiwZHJKyKtWBwREKsWIuEBkEiEmvZ4IiESIgVFBoEq0isdYQGQSoSazWhQbCaxFo2OCJhRazFhA6CRCTWKkKDIBWJtZrQIFhNYi0YHJGwItZiQgdBIhJr0eCIhFix+hQaBKtIrHWEBkEqEmsd/YYGQSISay2hQZCKxFpHaBCkIrFWExoEq0msZYMjEiIhVpLQIEhFYq0mNAhSkVirCQ2C1STW8gEy/p8Bq0qsZYMjEqKIF/I/BAAAAAAAAAAAAAAAAOB/4B/M+HNdHmHPdAAAAABJRU5ErkJggg=='

export interface PDFSummary {
  label: string
  value: string
}

/**
 * Exporta dados para PDF estilizado com logo Jinbe
 */
export function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string,
  title?: string,
  summary?: PDFSummary[]
): void {
  // Criar HTML formatado para impressão como PDF
  const headers = columns.map(col =>
    `<th>${col.header}</th>`
  ).join('')

  const rows = data.map((row, i) => {
    const cells = columns.map(col => {
      const value = row[col.key]
      const formatted = col.formatter ? col.formatter(value) : String(value ?? '')
      return `<td class="${i % 2 === 0 ? 'even' : 'odd'}">${formatted}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  // Gerar cards de resumo se fornecidos
  const summaryHTML = summary ? `
    <div class="summary-grid">
      ${summary.map(item => `
        <div class="summary-card">
          <div class="summary-label">${item.label}</div>
          <div class="summary-value">${item.value}</div>
        </div>
      `).join('')}
    </div>
  ` : ''

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || 'Relatório Jinbe'}</title>
      <style>
        @page {
          margin: 0;
          size: A4;
        }
        @media print {
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .header { break-inside: avoid; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          background: #f8fafc;
          color: #1e293b;
          line-height: 1.5;
        }

        /* Header com logo */
        .header {
          background: linear-gradient(135deg, #0d7ff2 0%, #0066cc 50%, #004d99 100%);
          padding: 30px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo {
          height: 40px;
          width: auto;
        }
        .header-text {
          color: white;
        }
        .header-title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .header-subtitle {
          font-size: 13px;
          opacity: 0.85;
          margin-top: 2px;
        }
        .header-meta {
          text-align: right;
          color: white;
        }
        .header-date {
          font-size: 13px;
          opacity: 0.9;
        }
        .header-records {
          font-size: 12px;
          opacity: 0.75;
          margin-top: 4px;
        }

        /* Conteúdo */
        .content {
          padding: 30px 40px;
          background: white;
          min-height: calc(100vh - 150px);
        }

        /* Cards de resumo */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }
        .summary-label {
          font-size: 11px;
          color: #0369a1;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .summary-value {
          font-size: 18px;
          font-weight: 700;
          color: #0c4a6e;
        }

        /* Tabela */
        .table-container {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        table {
          border-collapse: collapse;
          width: 100%;
          font-size: 11px;
        }
        thead {
          background: linear-gradient(135deg, #0d7ff2 0%, #0066cc 100%);
        }
        th {
          color: white;
          font-weight: 600;
          padding: 14px 12px;
          text-align: left;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
          border: none;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        td.even { background: #ffffff; }
        td.odd { background: #f8fafc; }
        tbody tr:hover td { background: #f0f9ff; }
        tbody tr:last-child td { border-bottom: none; }

        /* Footer */
        .footer {
          background: #f1f5f9;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 11px;
        }
        .footer-logo {
          height: 20px;
          opacity: 0.7;
        }
        .footer-info {
          color: #94a3b8;
          font-size: 10px;
          text-align: right;
        }

        /* Badge de status */
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-container">
          <img src="${JINBE_LOGO_BASE64}" alt="Jinbe" class="logo" />
          <div class="header-text">
            <div class="header-title">${title || 'Relatório'}</div>
            <div class="header-subtitle">Plataforma de Pagamentos Internacionais</div>
          </div>
        </div>
        <div class="header-meta">
          <div class="header-date">${new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
          <div class="header-records">${data.length} registro${data.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div class="content">
        ${summaryHTML}
        <div class="table-container">
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>

      <div class="footer">
        <div class="footer-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          Gerado automaticamente pela plataforma Jinbe
        </div>
        <div class="footer-info">
          ${filename}<br>
          jinbe.io
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        }
      </script>
    </body>
    </html>
  `

  // Abrir em nova aba para impressão/salvar como PDF
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
  }
}

/**
 * Helper para download de blob
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Formatadores comuns
 */
export const formatters = {
  currency: (value: unknown, currency = 'EUR') => {
    if (typeof value !== 'number') return String(value ?? '')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value)
  },

  date: (value: unknown) => {
    if (!value) return ''
    const date = new Date(value as string | number)
    return date.toLocaleDateString('pt-BR')
  },

  datetime: (value: unknown) => {
    if (!value) return ''
    const date = new Date(value as string | number)
    return date.toLocaleString('pt-BR')
  },

  percent: (value: unknown) => {
    if (typeof value !== 'number') return String(value ?? '')
    return `${value.toFixed(2)}%`
  },

  number: (value: unknown) => {
    if (typeof value !== 'number') return String(value ?? '')
    return new Intl.NumberFormat('pt-BR').format(value)
  },
}

/**
 * Função unificada de exportação
 */
export function exportData<T extends Record<string, unknown>>(
  format: ExportFormat,
  data: T[],
  columns: ExportColumn[],
  filename: string,
  title?: string,
  summary?: PDFSummary[]
): void {
  const timestamp = new Date().toISOString().split('T')[0]
  const fullFilename = `${filename}_${timestamp}`

  switch (format) {
    case 'csv':
      exportToCSV(data, columns, fullFilename)
      break
    case 'excel':
      exportToExcel(data, columns, fullFilename)
      break
    case 'pdf':
      exportToPDF(data, columns, fullFilename, title, summary)
      break
  }
}
