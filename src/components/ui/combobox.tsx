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

type ComboboxProps = {
  defaultTitle?: string
  defaultComandPlaceHolder?: string
  defaultComandEmpty?: string
  items?: { value: string; label: string }[]
  value?: string
  className?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export function Combobox({ defaultTitle, defaultComandPlaceHolder, defaultComandEmpty, items, value: initialValue, className, disabled, onChange }: ComboboxProps) {
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
          disabled={disabled}
        >
          { value
              ? items && items.find((item) => item.value === value)?.label
              : defaultTitle ? defaultTitle : "Selecione..."
          }
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={defaultComandPlaceHolder ? defaultComandPlaceHolder : "Pesquise..."} />
          <CommandList>
            <CommandEmpty>{defaultComandEmpty ? defaultComandEmpty : "Nenhum registro encontrado."}</CommandEmpty>
            <CommandGroup>
              {items && items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onChange?.(currentValue)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item.value ? "opacity-100" : "opacity-0"
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
