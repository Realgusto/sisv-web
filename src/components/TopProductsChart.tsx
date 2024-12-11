'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { cn } from '@/lib/utils'
import { format } from '@/utils'

interface TopProductsChartProps {
  data: Array<{
    nome: string;
    quantidade: number;
    unidade: string;
    fill: string;
  }>;
}

const CONTAINER_HEIGHT = cn('h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]')

export function TopProductsChart({ data }: TopProductsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1700, height: 450 });
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    const handleResize = () => {
      setTimeout(updateDimensions, 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return <div className={cn(CONTAINER_HEIGHT, 'w-full')} />;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: { value: number }[]; label: string }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-sm font-bold text-foreground">
            {format(payload[0].value, false)} { data.find((prod) => prod.nome === label)?.unidade }
          </p>
        </Card>
      );
    }
    return null;
  };

  return (
      <div ref={containerRef} className={cn(CONTAINER_HEIGHT, 'w-full')}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              dataKey="nome"
              type="category"
              stroke={'hsl(var(--foreground))'}
              tick={{ fontSize: 11, fontFamily: 'Quicksand' }}
              tickFormatter={(label) => `${label.slice(0, 7)}`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              dataKey="quantidade"
              type="number"
              stroke={'hsl(var(--foreground))'}
              tick={{ fontSize: 12, fontFamily: 'Quicksand' }}
              tickFormatter={(value) => `${format(value, false)}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip active={false} payload={[]} label="" />}
              cursor={{ 
                  fill: currentTheme === 'dark' ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)' 
              }}
            />
            <Bar
              dataKey="quantidade"
              fill="hsl(var(--chart-4))"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              animationBegin={0}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
  );
} 