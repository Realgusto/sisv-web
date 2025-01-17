'use client'

import { useUser } from "@/contexts/UserContext"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeftRight } from "lucide-react"
import Hoverable from "./Hoverable"

export default function CompanyID() {
    const { push } = useRouter()
    const { companySelected, clearCompany } = useUser()

    return (
        <>
            {companySelected && (
                <Hoverable className="right-0 top-9 min-w-44 bg-secondary text-secondary-foreground"
                    renderHoverContent={() => (
                        <>
                            <h2 className="text-sm font-medium select-none sm:text-base">
                                {companySelected.fantasy ? companySelected.fantasy : companySelected.name}
                            </h2>
                            <p className="text-xs select-none font-light">
                                CNPJ: {companySelected.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                            </p>
                        </>
                )}>
                    <Button
                        variant={"ghost"}
                        size={"default"}
                        onClick={() => {
                            clearCompany()
                            push('/companies')
                        }}
                    >
                        <ArrowLeftRight size={32} className="h-4 w-4" />
                        <span className="sr-only">Trocar de Empresa</span>
                    </Button>
                </Hoverable>
            )}
        </>
    )
}