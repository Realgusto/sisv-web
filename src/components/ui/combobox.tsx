"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const departments = [
  {
    value: "Tecnologia",
    label: "Tecnologia",
  },
  {
    value: "Administração",
    label: "Administração",
  },
  {
    value: "Financeiro",
    label: "Financeiro",
  },
  {
    value: "Vendas",
    label: "Vendas",
  },
  {
    value: "Compras",
    label: "Compras",
  },
  {
    value: "Estoque",
    label: "Estoque",
  }
]

type ComboboxProps = {
  value?: string
  className?: string
  onChange?: (value: string) => void
}

export function Combobox({ value: initialValue, className, onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialValue || "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? departments.find((department) => department.value === value)?.label
            : "Selecione o setor..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Pesquise o setor..." />
          <CommandList>
            <CommandEmpty>Nenhum setor encontrado.</CommandEmpty>
            <CommandGroup>
              {departments.map((department) => (
                <CommandItem
                  key={department.value}
                  value={department.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onChange?.(currentValue)
                  }}
                >
                  {department.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === department.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
