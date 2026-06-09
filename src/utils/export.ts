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

/**
 * Exporta dados para PDF (versão simplificada - abre em nova aba para impressão)
 */
export function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string,
  title?: string
): void {
  // Criar HTML formatado para impressão como PDF
  const headers = columns.map(col =>
    `<th style="background:#0d7ff2;color:white;font-weight:bold;padding:10px 8px;border:1px solid #ddd;text-align:left;">${col.header}</th>`
  ).join('')

  const rows = data.map((row, i) => {
    const cells = columns.map(col => {
      const value = row[col.key]
      const formatted = col.formatter ? col.formatter(value) : String(value ?? '')
      const bgColor = i % 2 === 0 ? '#ffffff' : '#f8fafc'
      return `<td style="background:${bgColor};padding:8px;border:1px solid #ddd;">${formatted}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title || 'Relatório Jinbe'}</title>
      <style>
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #0d7ff2; margin-bottom: 5px; }
        .meta { color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; font-size: 11px; }
        th, td { text-align: left; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 10px; }
      </style>
    </head>
    <body>
      ${title ? `<h1>${title}</h1>` : ''}
      <div class="meta">
        Gerado em: ${new Date().toLocaleString('pt-BR')}<br>
        Total de registros: ${data.length}
      </div>
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Jinbe Platform - ${filename}</div>
      <script>window.onload = function() { window.print(); }</script>
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
  title?: string
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
      exportToPDF(data, columns, fullFilename, title)
      break
  }
}
