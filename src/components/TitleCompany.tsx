'use client'

import { useUser } from "@/contexts/UserContext"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeftRight } from "lucide-react"

export default function TitleCompany() {
    const { push } = useRouter()

    const { companySelected } = useUser()

    // const [ date, setDate ] = useState<Date>(new Date())
    // const [ isPopoverOpen, setIsPopoverOpen ] = useState(false)

    return (
        <>
            {   companySelected &&
                <div className="flex justify-center items-center opacity-50">
                    <div className="flex justify-center items-center">
                        <h1 className="text-sm font-bold select-none sm:text-lg">
                            Bem vindo à {companySelected?.fantasy ? companySelected.fantasy : companySelected.name} - CNPJ: {companySelected.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                        </h1>
                        <Button
                            variant={"ghost"}
                            className="text-xs font-normal ml-2"
                            onClick={() => push('/companies')}
                            title="Trocar de empresa"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                        
                    </div>

                    {/* <div>
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"ghost"}
                                    className={cn(
                                        "justify-start text-left font-normal w-full mt-1",
                                        !date && "text-muted-foreground",
                                        // visualize && 'cursor-not-allowed'
                                    )}
                                    // disabled={visualize}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? new Date(date).toLocaleDateString('pt-BR') : <span>Selecione a data para visualizar as métricas</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-full">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(date) => setDate(date || new Date())}
                                    locale={ptBR}
                                    title="Selecione a data para visualizar as métricas"
                                    onDayClick={() => setIsPopoverOpen(false)}
                                    required
                                />
                            </PopoverContent>
                        </Popover>
                    </div> */}
                </div>
            }
        </>
    )
}