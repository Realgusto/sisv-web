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
import { Edit, MoreVertical, PackageX, Plus, X } from 'lucide-react'
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
import { Purchase, Status } from '@prisma/client'
import { useUser } from '@/contexts/UserContext'
import FetchAPI from '@/utils/fetch-api'
// import CalendarDatePicker from '@/components/CalendarDatePicker'
import NotFound from '@/components/NotFound'
import { useRouter } from 'next/navigation'
import { usePurchase } from '@/contexts/PurchaseContext'

export default function Order() {
    const { push } = useRouter()
    const { setPage, setMode, setPurchase } = usePurchase()
    const { user, companySelected } = useUser()
    
    // const [date, setDate] = useState<Date>(new Date())

    const [orders, setOrders] = useState<Purchase[]>([])
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [currentOrder, setCurrentOrder] = useState<Purchase | null>(null)

    const handleOpenDialog = (order: Purchase | null = null) => {
        if (order) {
            setMode('edit')
            setPurchase({...order, items: []})
        } else {
            setMode('new')
            setPurchase({
                id: '',
                companyId: '',
                date: new Date(),
                delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
                user_id: user ? user.id : '',
                supplier: '',
                total_value: 0,
                status: Status.Recebida,
                department: '',
                observations: '',
                updated_at: null,
                items: []
            })
        }
        setPage('order')
        push('/movements/purchases/new')
    }

    const handleItemDoubleClick = async (order: Purchase) => {
        setMode('visualize')
        setPurchase({...order, items: []})
        setPage('order')
        push('/movements/purchases/new')
    }

    const handleOpenAlertDialog = (order: Purchase) => {
        setCurrentOrder(order)
        setIsAlertDialogOpen(true)
    }

    const handleDeleteOrder = async () => {
        setIsDeleting(true)
        try {
            const response = await FetchAPI({
                URL: '/api/purchases',
                method: 'DELETE',
                body: JSON.stringify({
                    id: currentOrder?.id,
                    companyId: companySelected ?
                                    companySelected.id
                                    :
                                    ''
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao cancelar a ordem: ' + response.statusText)
            }

            const data = await response.json()
            // const orderAnt = orders 
            setOrders(prevOrders => prevOrders.filter(order => order.id !== data.id));
            toast.success(data.message, {
                // description: "Clique aqui se deseja restaurar a ordem",
                // action: {
                //       label: "Restaurar",
                //       onClick: () => setOrders(orderAnt),
                // },
            })
            setIsAlertDialogOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Ocorreu um erro ao cancelar a ordem. Tente novamente mais tarde: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const response = await FetchAPI({
                    URL: '/api/purchases?page=order&companyId=' + companySelected?.id,
                    method: 'GET'
                })

                if ((response.status !== 200) && (response.status !== 404)) {
                    throw new Error('Erro ao buscar ordens: ' + response.statusText)
                } else if (response.status === 404) {
                    toast.error('Nenhuma ordem encontrada')
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
        }

        fetchOrders()
    }, [companySelected?.id])

    return (
        <div className="p-4 sm:p-6 bg-background min-h-screen h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold select-none sm:text-lg">Ordens de Compra</h1>
                {/* <CalendarDatePicker
                    Icon={<CalendarIcon className="mr-2 h-5 w-5" />}
                    defaultTitle="Selecione a data para visualizar as ordens"
                    selected={date}
                    onSelect={(dt) => setDate(dt ? dt : new Date())}
                    className="w-auto"
                /> */}
                <Button
                    onClick={() => handleOpenDialog()} 
                    className="bg-primary text-white w-10 sm:w-36 hover:bg-primary/80"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block ml-2">Ordem</span>
                </Button>
            </div>
            {   orders.length === 0 && !isLoading ? 
                <NotFound title='Nenhuma ordem encontrada. Para iniciar, clique no botão "Ordem" acima, e crie uma nova ordem.' />
            :
                <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                    <TableCaption className="select-none">Uma lista das suas ordens de compra.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead hidden className="sm:w-[120px] select-none">ID</TableHead>
                            <TableHead className="w-[100px] sm:w-[120px] select-none">Data</TableHead>
                            <TableHead className="w-[100px] sm:w-[120px] select-none">Setor</TableHead>
                            <TableHead className="select-none">Fornecedor</TableHead>
                            <TableHead className="w-[80px] sm:w-[150px] select-none">Status</TableHead>
                            <TableHead className="w-[80px] sm:w-[150px] text-right select-none">Valor</TableHead>
                            <TableHead className="w-[35px] sm:w-[50px] text-right select-none">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {   isLoading ? 
                            <TableRow className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
                                <TableCell hidden className="h-[120px] sm:h-[80px]">
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
                                <TableRow key={order.id} onDoubleClick={() => handleItemDoubleClick(order)} className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
                                    <TableCell hidden className="font-light text-[10px] sm:text-xs sm:w-[30px]">{order.id}</TableCell>
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
                                                        Deseja cancelar a ordem de compra?
                                                        { currentOrder?.supplier && <><br />Fornecedor: {currentOrder.supplier}</> }
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
                            <TableCell colSpan={4} className="select-none text-base font-bold">Total</TableCell>
                            <TableCell className="w-[80px] sm:w-[150px] text-right select-none text-base font-bold">
                                {Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                }).format(orders.reduce((total, order) => {
                                    if (order.status === Status.Faturada || order.status?.startsWith('Pedido')) {
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