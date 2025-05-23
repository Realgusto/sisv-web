"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from 'next/navigation'
import type { Company } from "@prisma/client"
import { ExternalLink } from "lucide-react"
import { URL_ADMIN, URL_NON_ADMIN } from "@/constants"
import { useEffect } from "react"

export default function Companies() {
    const { push } = useRouter()
    const { user, companies, companySelected, selectCompany } = useUser()

    useEffect(() => {
        if (companySelected) {
            if (user?.admin) {
                push(URL_ADMIN)
            } else {
                push(URL_NON_ADMIN)
            }
        }
    }, [companySelected, user?.admin, push])

    const clickCompany = (company: Company) => {
        selectCompany(company)
        if (user?.admin) {
            push(URL_ADMIN)
        } else {
            push(URL_NON_ADMIN)
        }
    }

    const styleCard = "h-48 transition duration-400 ease-in-out transform hover:-translate-y-1 hover:shadow-sm hover:border-primary/80 hover:shadow-muted-foreground/75 select-none hover:cursor-pointer"
    
    return (
        <div className="p-6 space-y-6 w-full max-w-full">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-4">
                {companies && companies.map((company) => (
                    <Card key={company.id} className={styleCard} onClick={() => clickCompany(company)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl sm:text-2xl font-bold">{company.fantasy ? company.fantasy : company.name}</CardTitle>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            { 
                                company.address && company.city && company.state &&
                                <CardDescription className="text-sm sm:text-base text-muted-foreground mb-1">
                                    Localizado em {company.address}, {company.city} - {company.state}
                                </CardDescription>
                            }
                            {
                                company.cnpj &&
                                <CardDescription className="text-sm sm:text-base text-muted-foreground mb-1">
                                    CNPJ: {company.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}
                                </CardDescription>
                            }
                            {
                                company.phone &&
                                <CardDescription className="text-sm sm:text-base text-muted-foreground mb-1">
                                    Telefone: {company.phone}
                                </CardDescription>
                            }
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}