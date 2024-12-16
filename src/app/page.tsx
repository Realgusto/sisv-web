"use client"

import { useEffect } from "react";

import { redirect } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export default function Page() {
    const user = useUser()
    
    useEffect(() => {
        if (user) {
            redirect('/dashboard')
        } else {
            redirect('/login')
        }
    }, [user])

    return <div className="flex h-screen w-screen items-center justify-center font-bold text-2xl">Redirecionando...</div>
}