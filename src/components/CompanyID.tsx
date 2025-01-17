'use client'

import { useState } from "react"
import { useUser } from "@/contexts/UserContext"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeftRight } from "lucide-react"

export default function CompanyID() {
    const { push } = useRouter()
    const { companySelected, clearCompany } = useUser()
    const [ isHovering, setIsHovering ] = useState(false)

    return (
        <>
            {   companySelected && isHovering && (
                <div className={`right-12 absolute min-w-40 mt-10 bg-secondary text-secondary-foreground p-3 rounded-md shadow-md transition-opacity duration-500 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    {companySelected && (
                        <h2 className="text-sm font-medium select-none sm:text-base">
                            {companySelected.fantasy ? companySelected.fantasy : companySelected.name}
                        </h2>
                    )}
                    {companySelected && (
                        <p className="text-xs select-none font-light">
                            CNPJ: {companySelected.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
                        </p>
                    )}
                </div>
            )}

            {   companySelected &&
                <Button
                    variant={"ghost"}
                    size={"default"}
                    onClick={() => {
                        setIsHovering(false)
                        clearCompany()
                        push('/companies')
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseOut={() => setIsHovering(false)}
                >
                    <ArrowLeftRight className="h-4 w-4" />
                    <span className="sr-only">Trocar de Empresa</span>
                </Button>
            }
        </>
    )
}


{/* <h1 className="text-sm font-bold select-none sm:text-lg">
    Bem vindo à {companySelected?.fantasy ? companySelected.fantasy : companySelected.name} - CNPJ: {companySelected.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}
</h1> */}