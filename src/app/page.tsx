"use client"

import { useEffect } from "react";

import { redirect } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { URL_ENTRY } from "@/constants";

export default function Page() {
    const user = useUser()
    
    useEffect(() => {
        if (user) {
            redirect(URL_ENTRY)
        } else {
            redirect('/login')
        }
    }, [user])

    return <div className="flex h-screen w-screen items-center justify-center font-bold text-2xl text-primary">Redirecionando...</div>
}