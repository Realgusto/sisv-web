import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export default function Shortcuts() {
    const styleCard = "h-48 transition duration-400 ease-in-out transform hover:-translate-y-1 hover:shadow-sm hover:shadow-muted-foreground/75 select-none hover:cursor-pointer"
    
    return (
        <div className="p-6 space-y-6 w-full max-w-full overflow-x-hidden">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atalhos Úteis</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Aprenda a usar atalhos para aumentar sua produtividade.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dicas de Segurança</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Proteja sua conta com senhas fortes e autenticação de dois fatores.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novidades</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Descubra as últimas novidades e atualizações do sistema.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novidades</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Descubra as últimas novidades e atualizações do sistema.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novidades</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Descubra as últimas novidades e atualizações do sistema.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dicas de Segurança</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Proteja sua conta com senhas fortes e autenticação de dois fatores.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novidades</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Descubra as últimas novidades e atualizações do sistema.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novidades</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Descubra as últimas novidades e atualizações do sistema.
                        </CardDescription>
                    </CardContent>
                </Card>

                <Card className={styleCard}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novidades</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-sm">
                            Descubra as últimas novidades e atualizações do sistema.
                        </CardDescription>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}