"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Budget() {
    return (
        <div className="p-6 bg-background min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4 select-none">Orçamentos</h1>
                <Button 
                    onClick={() => {}} 
                    className="mb-4 bg-blue-500 text-white hover:bg-blue-600"
                >
                    <Plus className="h-5 w-5 mr-2" /> Adicionar Orçamento
                </Button>
            </div>
        </div>
    )
}