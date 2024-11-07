'use client'

import { useTheme } from 'next-themes'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'

interface VendasMensais {
  mes: string
  valor: number
}

interface SalesChartProps {
  data: VendasMensais[]
}

export function SalesChart({ data }: SalesChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1700, height: 450 })
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }

    const handleResize = () => {
        setTimeout(updateDimensions, 500)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full" />
  }

  const currentTheme = theme === 'system' ? systemTheme : theme

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      const abbreviated = (value / 1000).toFixed(1)
      // Remove o .0 quando não há decimais
      const finalValue = abbreviated.endsWith('.0') 
        ? abbreviated.slice(0, -2) 
        : abbreviated
      return `R$ ${finalValue}K`
    }
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: { value: number }[]; label: string }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm font-bold text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </Card>
      )
    }
    return null
  }

  return (
    <div ref={containerRef} className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={{ top: 16, right: 2, left: -10, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={currentTheme === 'dark' ? '#374151' : '#E5E7EB'}
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            stroke={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.slice(0, 3)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomTooltip active={false} payload={[]} label="" />}
            cursor={{ stroke: currentTheme === 'dark' ? '#4B5563' : '#D1D5DB' }}
          />
          <Area
            type="monotone"
            dataKey="valor"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}