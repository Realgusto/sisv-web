'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { SelectSingleEventHandler } from "react-day-picker"
import { ptBR } from 'date-fns/locale'

type CalendarProps = {
    Icon: React.ReactNode    //React.ComponentType<React.SVGProps<SVGSVGElement>>
    defaultTitle: string
    selected?: Date
    onSelect?: SelectSingleEventHandler | undefined  //(date: Date) => void
    className?: string
    required?: boolean
}

export default function CalendarDatePicker({ Icon, defaultTitle, selected, onSelect, className, required }: CalendarProps) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    return (
        <div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"ghost"}
                        className={cn(
                            "font-normal w-full",
                            !selected && "text-muted-foreground",
                            className
                        )}
                    >
                        {Icon}
                        {selected ? new Date(selected).toLocaleDateString('pt-BR') : defaultTitle}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full">
                    <Calendar
                        mode="single"
                        selected={selected ? selected : new Date()}
                        onSelect={onSelect}
                        initialFocus
                        locale={ptBR}
                        title={defaultTitle}
                        onDayClick={() => setIsPopoverOpen(false)}
                        required={required}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}