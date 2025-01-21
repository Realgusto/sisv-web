"use client"

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { URL_ENTRY } from "@/constants";
import LogRocket from 'logrocket';

export default function Page() {
    const { user } = useUser()
    const { push } = useRouter()
    
    useEffect(() => {
        LogRocket.init('log/sisv')
        
        if (user) {
            push(URL_ENTRY)
        } else {
            push('/login')
        }
    }, [user])

    return <div className="flex h-screen w-screen items-center justify-center font-bold text-2xl text-primary">Redirecionando...</div>
}