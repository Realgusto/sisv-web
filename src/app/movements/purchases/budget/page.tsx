"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog'
import { v4 as uuidv4 } from 'uuid'
import { CalendarIcon, ClipboardPenLine, Edit, MoreVertical, PackageX, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'
import { ptBR } from 'date-fns/locale'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
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
import { Combobox } from '@/components/ui/combobox'
import { useUser } from '@/contexts/UserContext'
import FetchAPI from '@/utils/fetch-api'
import NotFound from '@/assets/NotFound.json'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function Budget() {
    const { user, companySelected } = useUser()

    const [orders, setOrders] = useState<Purchase[]>([])
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [propsDialog, setPropsDialog] = useState(false)
    const [visualize, setVisualize] = useState(false)
    const [currentOrder, setCurrentOrder] = useState<Purchase | null>(null)

    useEffect(() => {
        setCurrentOrder({
            id: '',
            companyId: '',
            date: new Date(),
            delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
            user_id: user ? user.id : '',
            supplier: '',
            product: '',
            quantity: 0,
            value: 0,
            status: Status.Aberta,
            department: '',
            observations: '',
            updated_at: null
        })
    }, [user])

    const handleOpenDialog = (order: Purchase | null = null) => {
        if (order) {
            setCurrentOrder(order)
        } else {
            setCurrentOrder({
                id: '',
                companyId: '',
                date: new Date(),
                delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
                user_id: user ? user.id : '',
                supplier: '',
                product: '',
                quantity: 0,
                value: 0,
                status: Status.Aberta,
                department: '',
                observations: '',
                updated_at: null
            })
        }
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setCurrentOrder({
            id: '',
            companyId: '',
            date: new Date(),
            delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
            user_id: user ? user.id : '',
            supplier: '',
            product: '',
            quantity: 0,
            value: 0,
            status: Status.Aberta,
            department: '',
            observations: '',
            updated_at: null
        })
        setDialogOpen(false)
        setPropsDialog(false)
        setVisualize(false)
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
                    companyId: companySelected ? companySelected.id : ''
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao cancelar o orçamento: ' + response.statusText)
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
            alert('Ocorreu um erro ao cancelar o orçamento. Tente novamente mais tarde: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true);

        if (!currentOrder) return;

        if (currentOrder.department === null || currentOrder.department === '' || currentOrder.product === '' || currentOrder.quantity <= 0) {
            toast.error('Preencha todos os campos corretamente')
            setIsSubmitting(false)
            return
        }

        let defaultStatus: Status

        if (propsDialog) {
            if (currentOrder.supplier === null || currentOrder.supplier === '' || currentOrder.value === null || currentOrder.value <= 0) {
                toast.error('Preencha todos os campos corretamente')
                setIsSubmitting(false)
                return
            }

            defaultStatus = Status.Faturada
        } else {
            defaultStatus = Status.Aberta
        }

        const newOrder: Purchase = {
            id: currentOrder.id !== '' ? currentOrder.id : uuidv4(),
            companyId: companySelected ? companySelected.id : '',
            date: currentOrder.id !== '' ? currentOrder.date : new Date(),
            user_id: user ? user.id : '',
            supplier: currentOrder.supplier,
            status: defaultStatus,
            value: currentOrder.value,
            delivery_date: currentOrder.delivery_date,
            product: currentOrder.product,
            quantity: currentOrder.quantity,
            department: currentOrder.department,
            observations: currentOrder.observations,
            updated_at: new Date()
        }

        try {
            const method = currentOrder?.id ? 'PUT' : 'POST';
            
            const response = await FetchAPI({
                URL: '/api/purchases',
                method,
                body: JSON.stringify(newOrder)
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar o orçamento: ' + response.statusText);
            }

            const data = await response.json();
            if (currentOrder?.id) {
                setOrders(prevOrders => prevOrders.map(order => order.id === data.id ? data : order));
            } else {
                setOrders(prevOrders => [...prevOrders, data]);
            }
            handleCloseDialog()
        } catch (error) {
            console.error('Erro ao salvar o orçamento: ', error)
            alert('Ocorreu um erro ao salvar o orçamento. Tente novamente mais tarde: ' + error)
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleItemDoubleClick = async (order: Purchase) => {
        setCurrentOrder(order)
        setVisualize(true)
        setDialogOpen(true)
    }

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const response = await FetchAPI({
                    URL: '/api/purchases?page=budget&companyId=' + companySelected?.id,
                    method: 'GET'
                })

                if ((response.status !== 200) && (response.status !== 404)) {
                    throw new Error('Erro ao buscar orçamentos: ' + response.statusText)
                } else if (response.status === 404) {
                    toast.error('Nenhum orçamento encontrado')
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
                <h1 className="text-xl font-bold select-none sm:text-lg">Orçamentos</h1>
                <Button 
                    onClick={() => handleOpenDialog()} 
                    className="bg-primary text-white w-10 sm:w-36 hover:bg-primary/80"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block ml-2">Orçamento</span>
                </Button>
            </div>
            {   orders.length === 0 && !isLoading ?
                    <div className="p-4 space-y-4 w-full max-w-full overflow-x-hidden">
                        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
                            <Lottie
                                animationData={NotFound}
                                loop={true}
                                autoplay={true}
                                className="w-72"
                            />
                            <h1 className="text-lg font-bold text-center text-wrap">
                                Nenhum orçamento encontrado. Para iniciar, clique no botão Orçamento acima, e crie um novo orçamento.
                            </h1>
                        </div>
                    </div>
                :
                    <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                        <TableCaption className="select-none">Uma lista dos seus orçamentos.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead hidden className="sm:w-[120px] select-none">ID</TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] select-none">Data</TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] select-none">Setor</TableHead>
                                <TableHead className="select-none">Produto</TableHead>
                                <TableHead className="w-[80px] sm:w-[150px] select-none">Quant.</TableHead>
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
                                    <TableRow 
                                        key={order.id} 
                                        onDoubleClick={() => handleItemDoubleClick(order)} 
                                        className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800"
                                    >
                                        <TableCell hidden className="font-light text-[10px] sm:text-xs sm:w-[30px]">{order.id}</TableCell>
                                        <TableCell className="w-[100px] sm:w-[120px] text-xs sm:text-base select-none">{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell className="w-[100px] sm:w-[120px] text-xs sm:text-base select-none">{order.department ? order.department : 'N . D'}</TableCell>
                                        <TableCell className="select-none text-xs sm:text-base">{order.product}</TableCell>
                                        <TableCell className="w-[80px] sm:w-[150px] select-none text-xs sm:text-base">{Number(order.quantity).toLocaleString('pt-BR')} UN</TableCell>
                                        <TableCell className="w-[80px] sm:w-[150px] text-right select-none text-xs sm:text-base font-bold">
                                            {Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            }).format(order.value || 0)}
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
                                                    <DropdownMenuItem onClick={() => {
                                                        toast.info('Preencha o fornecedor e o valor para criar uma ordem de compra a partir do orçamento.')

                                                        handleOpenDialog(order)
                                                        setPropsDialog(true)
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
                                                            Deseja cancelar o orçamento?
                                                            { currentOrder?.product && <><br />Produto: {currentOrder.product}</> }
                                                            { currentOrder?.department && <><br />Setor: {currentOrder.department}</> }
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
                                            return total + (order.quantity * (order.value || 0))
                                        }
                                        return total
                                    }, 0))}
                                </TableCell>
                                <TableCell className="w-[35px] sm:w-[50px] text-right select-none" />
                            </TableRow>
                        </TableFooter>
                    </Table>
            }

            <div className="flex justify-center items-center rounded-lg">
                <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                    <DialogContent className="max-w-[350px] max-h-[450px] sm:max-w-[425px] sm:max-h-[720px] lg:max-h-none">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-base">
                                {
                                    visualize ?
                                        'Visualizar Orçamento' : 
                                    currentOrder?.id !== '' ?
                                        'Editar Orçamento' :
                                        'Adicionar Orçamento'
                                }
                            </DialogTitle>
                            <DialogDescription className="text-sm sm:text-base">
                                {
                                    visualize ?
                                        'Visualize o orçamento.' :
                                    currentOrder?.id !== '' ?
                                        'Faça alterações no orçamento aqui. Clique em salvar quando terminar.' :
                                        'Adicione um novo orçamento.'
                                }
                            </DialogDescription>
                        </DialogHeader> 
                        {currentOrder && (
                            <form onSubmit={handleSubmit} className="space-y-4 max-h-64 sm:max-h-72 lg:max-h-80 xl:max-h-96 2xl:max-h-none overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Previsão de Entrega (Obrigatório)</label>
                                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"secondary"}
                                                className={cn(
                                                    "justify-start text-left font-normal w-full mt-1",
                                                    !currentOrder.delivery_date && "text-muted-foreground",
                                                    visualize && 'cursor-not-allowed'
                                                )}
                                                disabled={visualize}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {currentOrder.delivery_date ? new Date(currentOrder.delivery_date).toLocaleDateString('pt-BR') : <span>Selecione a previsão de entrega</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-0 w-full">
                                            <Calendar
                                                mode="single"
                                                selected={new Date(currentOrder.delivery_date)}
                                                onSelect={(date) => setCurrentOrder({ ...currentOrder, delivery_date: date || new Date() })}
                                                initialFocus
                                                locale={ptBR}
                                                title="Selecione a data de entrega"
                                                onDayClick={() => setIsPopoverOpen(false)}
                                                required
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>                            
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Setor</label>
                                    <Combobox
                                        value={currentOrder.department || ''}
                                        className={cn("mt-1 w-full rounded-md shadow-sm p-2", visualize && 'cursor-not-allowed')}
                                        disabled={visualize}
                                        onChange={(value) => {
                                            if (visualize) {
                                                toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                            } else {
                                                setCurrentOrder({ ...currentOrder, department: value })
                                            }
                                        }} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Fornecedor{propsDialog ? ' (Obrigatório)' : ''}</label>
                                    <input 
                                        type="text" 
                                        value={currentOrder.supplier || ''} 
                                        onChange={(e) => setCurrentOrder({ ...currentOrder, supplier: e.target.value })} 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                        required={propsDialog}
                                        disabled={visualize}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Produto (Obrigatório)</label>
                                    <input 
                                        type="text"
                                        value={currentOrder.product}
                                        onChange={(e) => setCurrentOrder({ ...currentOrder, product: e.target.value })} 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                        required
                                        disabled={visualize}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Quantidade (Obrigatório)</label>
                                    <input 
                                        type="number" 
                                        value={currentOrder.quantity}
                                        onChange={(e) => setCurrentOrder({ ...currentOrder, quantity: Number(e.target.value) })} 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                        required
                                        disabled={visualize}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Valor Unitário{propsDialog ? ' (Obrigatório)' : ''}</label>
                                    <input 
                                        type="number" 
                                        value={currentOrder.value || ''}
                                        onChange={(e) => setCurrentOrder({ ...currentOrder, value: Number(e.target.value) })} 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                        required={propsDialog}
                                        disabled={visualize}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Observações</label>
                                    <Textarea
                                        value={currentOrder.observations || ''}
                                        onChange={(e) => setCurrentOrder({ ...currentOrder, observations: e.target.value })} 
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                        disabled={visualize}
                                    />
                                </div>

                                <DialogFooter>
                                    {   visualize ? 
                                        <Button
                                            className="bg-primary text-white hover:bg-primary/80"
                                            onClick={handleCloseDialog}
                                        >
                                            Fechar
                                        </Button>
                                        :
                                        <Button 
                                            type="submit"
                                            className={`bg-green-500 text-white hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Salvando...' : currentOrder.id !== '' ? 'Salvar Alterações' : 'Adicionar Orçamento'}
                                        </Button>
                                    }
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}