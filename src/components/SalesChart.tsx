'use client'

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
import { cn } from '@/lib/utils'
import { format } from '@/utils'

interface SalesChartProps {
  data: MonthlySales[]
}

export function SalesChart({ data }: SalesChartProps) {
  const CONTAINER_HEIGHT = cn('h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]')

  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1700, height: 450 })
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
    return <div className={cn(CONTAINER_HEIGHT, 'w-full')} />
  }

  const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: { value: number }[]; label: string }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-sm font-bold text-foreground">
            {format(payload[0].value)}
          </p>
        </Card>
      )
    }
    return null
  }

  return (
    <div ref={containerRef} className={cn(CONTAINER_HEIGHT, 'w-full')}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={dimensions.width}
          height={dimensions.height}
          data={data}
          margin={{ top: 16, right: 2, left: 0, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={'hsl(var(--foreground))'}
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="mes"
            stroke={'hsl(var(--foreground))'}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.slice(0, 3)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke={'hsl(var(--foreground))'}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => format(value)}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomTooltip active={false} payload={[]} label="" />}
            cursor={{ stroke: 'hsl(var(--foreground))'}}
          />
          <Area
            type="natural"
            dataKey="valor"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={true}
            activeDot={{ r: 4, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}