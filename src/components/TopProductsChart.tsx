'use client';

import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useRef, useState } from 'react';

interface TopProductsChartProps {
  data: Array<{
    nome: string;
    quantidade: number;
  }>;
}

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
    return <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full" />;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: { value: number }[]; label: string }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm font-bold text-primary">
            {payload[0].value} unidades
          </p>
        </Card>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                dataKey="nome"
                stroke={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                tick={{ fontSize: 12, fontFamily: 'Quicksand' }}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke={currentTheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value} un`}
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
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
                animationBegin={0}
                />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
} 