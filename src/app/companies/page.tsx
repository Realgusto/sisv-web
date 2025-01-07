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

export default function Companies() {
    const { push } = useRouter()
    const { companies, selectCompany } = useUser()

    const clickCompany = (company: Company) => {
        selectCompany(company)
        console.log(company)
        push('/dashboard')
    }    

    const styleCard = "h-48 transition duration-400 ease-in-out transform hover:-translate-y-1 hover:shadow-sm hover:border-primary/80 hover:shadow-muted-foreground/75 select-none hover:cursor-pointer"
    
    return (
        <div className="p-6 space-y-6 w-full max-w-full">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-4">
                {companies && companies.map((company) => (
                    <Card key={company.id} className={styleCard} onClick={() => clickCompany(company)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold">{company.fantasy ? company.fantasy : company.name}</CardTitle>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            { 
                                company.address && company.city && company.state &&
                                <CardDescription className="text-sm text-muted-foreground">
                                    Localizado em {company.address}, {company.city} - {company.state}
                                </CardDescription>
                            }
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}