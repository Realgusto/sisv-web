"use client"

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { URL_ENTRY } from "@/constants";

export default function Page() {
    const { user } = useUser()
    const { push } = useRouter()
    
    useEffect(() => {
        if (user) {
            push(URL_ENTRY)
        } else {
            push('/login')
        }
    }, [user, push])

    return <div className="flex h-screen w-screen items-center justify-center font-bold text-2xl text-primary">Redirecionando...</div>
}