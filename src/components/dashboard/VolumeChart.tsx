import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'

const data = [
  { month: 'JAN', value: 320000, target: 500000 },
  { month: 'FEB', value: 580000, target: 720000 },
  { month: 'MAR', value: 430000, target: 650000 },
  { month: 'APR', value: 920000, target: 1150000 },
  { month: 'MAY', value: 680000, target: 850000 },
  { month: 'JUN', value: 1050000, target: 1250000 },
]

const periods = ['6M', '1A', 'Tudo'] as const

export function VolumeChart() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [activePeriod, setActivePeriod] = useState<string>('6M')
  const [activeBar, setActiveBar] = useState<number | null>(null)

  const tooltipStyle = {
    background: isLight ? '#ffffff' : '#1a202c',
    border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
    borderRadius: '8px',
    color: isLight ? '#0f172a' : '#fff',
    fontSize: 12,
  }
  const tickColor = isLight ? '#64748b' : '#64748b'

  return (
    <div className="flex-1 flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-jinbe-text">Volume de Operações</h3>
          <p className="text-xs sm:text-sm text-jinbe-dim">Tendências mensais de liquidação internacional</p>
        </div>
        <div className="flex items-center p-1 bg-jinbe-hover rounded-lg self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activePeriod === p
                  ? 'bg-jinbe-active text-white shadow-sm'
                  : 'text-jinbe-dim hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[200px] sm:min-h-[250px] rounded-xl border border-dashed border-jinbe-hover bg-gradient-to-b from-jinbe-primary/10 to-transparent p-2 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: tickColor, fontSize: 9, fontWeight: 600 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={false}
              contentStyle={tooltipStyle}
              formatter={(val) =>
                `€${(Number(val) / 1000).toFixed(0)}k`
              }
            />
            <Bar
              dataKey="target"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, i) => setActiveBar(i)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={activeBar === i ? 'rgba(13,127,242,0.35)' : 'rgba(13,127,242,0.15)'}
                />
              ))}
            </Bar>
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={activeBar === i ? '#3b9ff5' : '#0d7ff2'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
