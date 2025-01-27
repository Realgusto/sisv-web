"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableCaption,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableFooter,
    TableCell
} from '@/components/ui/table'
import { ClipboardPenLine, Edit, MoreVertical, PackageX, Plus, X } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Purchase, StatusPurchase } from '@prisma/client'
import { useUser } from '@/contexts/UserContext'
import FetchAPI from '@/utils/fetch-api'
import NotFound from '@/components/NotFound'
import { useRouter } from 'next/navigation'
import { usePurchase } from '@/contexts/PurchaseContext'
import { formatZero } from '@/utils'


export default function Budget() {
    const { push } = useRouter()
    const { setPage, setMode, currentPurchase, setPurchase } = usePurchase()
    const { user, companySelected } = useUser()



    const [orders, setOrders] = useState<Purchase[]>([])
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleChangeStatus = (order: Purchase) => {
        setMode('edit')
        setPurchase({...order, status: StatusPurchase.Recebida, items: []})
        setPage('budget')
        push('/movements/purchases/new')
    }

    const handleOpenDialog = (order: Purchase | null = null) => {
        if (order) {
            setMode('edit')
            setPurchase({...order, items: []})
        } else {
            setMode('new')
            setPurchase({
                id: '',
                sequence: 0,
                companyId: '',
                date: new Date(),
                delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
                user_id: user ? user.id : '',
                approval_user_id: null,
                supplier: '',
                total_value: 0,
                status: StatusPurchase.Aberta,
                department: '',
                observations: '',
                updated_at: null,
                items: []
            })
        }
        setPage('budget')
        push('/movements/purchases/new')
    }

    const handleItemDoubleClick = async (order: Purchase) => {
        setMode('visualize')
        setPurchase({...order, items: []})
        setPage('budget')
        push('/movements/purchases/new')
    }

    const handleOpenAlertDialog = (order: Purchase) => {
        setPurchase({...order, items: []})
        setIsAlertDialogOpen(true)
    }

    const handleDeleteOrder = async () => {
        setIsDeleting(true)
        try {
            const response = await FetchAPI({
                URL: '/api/purchases',
                method: 'DELETE',
                body: JSON.stringify({
                    id: currentPurchase?.id,
                    companyId: companySelected ?
                                    companySelected.id
                                    :
                                    ''
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao cancelar a requisição: ' + response.statusText)
            }

            const data = await response.json()

            setOrders(prevOrders => prevOrders.filter(order => order.id !== data.id));
            toast.success(data.message, {
                // description: "Clique aqui se deseja restaurar o orçamento",
                // action: {
                    //   label: "Restaurar",
                    //   onClick: () => console.log("Restaurar"),
                // },
            })
            setIsAlertDialogOpen(false)
        } catch (error) {
            console.error(error)
            alert('Ocorreu um erro ao cancelar a requisição. Tente novamente mais tarde: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            if (companySelected?.id) {
                try {
                    const response = await FetchAPI({
                        URL: '/api/purchases?page=budget&companyId=' + companySelected.id,
                        method: 'GET'
                    })

                    if ((response.status !== 200) && (response.status !== 404)) {
                        throw new Error('Erro ao buscar requisições: ' + response.statusText)
                    } else if (response.status === 404) {
                        toast.error('Nenhuma requisição encontrada')
                        setOrders([])
                    } else {
                        const data = await response.json()
                        setOrders(data)
                    }
                } catch (error) {
                    console.error(error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setOrders([])
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [companySelected?.id])

    return (
        <div className="p-4 sm:p-6 bg-background min-h-screen h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold select-none sm:text-lg">Requisições</h1>
                <Button 
                    onClick={() => handleOpenDialog()} 
                    className="bg-primary text-white w-10 sm:w-36 hover:bg-primary/80"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block ml-2">Requisição</span>
                </Button>
            </div>
            {   orders.length === 0 && !isLoading ?
                    <NotFound title='Nenhuma requisição encontrada. Para iniciar, clique no botão "Requisição" acima, e crie uma nova requisição.' />
                :
                    <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                        <TableCaption className="select-none">Uma lista das suas requisições.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sm:w-[120px] select-none"><span className="ml-2">R.C</span></TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] select-none">Data</TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] select-none">Setor</TableHead>
                                <TableHead className="select-none">Fornecedor</TableHead>
                                <TableHead className="w-[80px] sm:w-[150px] select-none">Status</TableHead>
                                <TableHead className="w-[80px] sm:w-[150px] text-right select-none">Total</TableHead>
                                <TableHead className="w-[35px] sm:w-[50px] text-right select-none">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {   isLoading ? 
                                <TableRow className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
                                    <TableCell className="h-[120px] sm:h-[80px]">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                    <TableCell className="w-[100px] sm:w-[120px]">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                    <TableCell className="w-[100px] sm:w-[120px]">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                    <TableCell className="select-none">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                    <TableCell className="w-[80px] sm:w-[150px]">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                    <TableCell className="w-[80px] sm:w-[150px]">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                    <TableCell className="w-[35px] sm:w-[50px]">
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </TableCell>
                                </TableRow>
                            :
                                orders.map(order => (
                                    <TableRow
                                        key={order.id} 
                                        onDoubleClick={() => handleItemDoubleClick(order)} 
                                        className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800"
                                    >
                                        <TableCell className="font-semibold text-xs sm:text-sm sm:w-[30px]"><span className="ml-2">{formatZero(order.sequence, 6)}</span></TableCell>
                                        <TableCell className="w-[100px] sm:w-[120px] text-xs sm:text-base select-none">{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell className="w-[100px] sm:w-[120px] text-xs sm:text-base select-none">{order.department ? order.department : 'N . D'}</TableCell>
                                        <TableCell className="select-none text-xs sm:text-base">{order.supplier ? order.supplier : 'N . D'}</TableCell>
                                        <TableCell className="w-[80px] sm:w-[150px] select-none text-xs sm:text-base">{order.status ? order.status : 'N . D'}</TableCell>
                                        <TableCell className="w-[80px] sm:w-[150px] text-right select-none text-xs sm:text-base font-bold">
                                            {Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            }).format(order.total_value || 0)}
                                        </TableCell>
                                        <TableCell className="w-[35px] sm:w-[50px] text-right select-none">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant={"secondary"}
                                                        size={"icon"}
                                                    >
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem className="text-green-500 hover:text-green-600" onClick={() => {
                                                        toast.info('Revise a requisição e clique em "salvar" para criar uma ordem de compra.')
                                                        handleChangeStatus(order)
                                                    }}>
                                                        <ClipboardPenLine className="h-3 w-3 mr-2" /> Gerar Ordem
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(order)}>
                                                        <Edit className="h-3 w-3 mr-2" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 hover:text-red-500" onClick={() => handleOpenAlertDialog(order)}>
                                                        <PackageX className="h-3 w-3 mr-2" /> Cancelar
                                                    </DropdownMenuItem>                                            
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Deseja cancelar a requisição?                                                            
                                                            { currentPurchase?.supplier && <><br />Fornecedor: {currentPurchase.supplier}</> }
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                                                            <X className="h-3 w-3" />
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className={`bg-red-500 text-white hover:bg-red-600 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={() => handleDeleteOrder()}
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting ? 'Cancelando...' : <><PackageX className="h-3 w-3 mr-2" /> Cancelar</>}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} className="select-none text-base font-bold">Total</TableCell>
                                <TableCell className="w-[80px] sm:w-[150px] text-right select-none text-base font-bold">
                                    {Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(orders.reduce((total, order) => {
                                        if (order.status === StatusPurchase.Faturada || order.status?.startsWith('Pedido')) {
                                            return total + (order.total_value || 0)
                                        }
                                        return total
                                    }, 0))}
                                </TableCell>
                                <TableCell className="w-[35px] sm:w-[50px] text-right select-none" />
                            </TableRow>
                        </TableFooter>
                    </Table>
            }
        </div>
    );
}