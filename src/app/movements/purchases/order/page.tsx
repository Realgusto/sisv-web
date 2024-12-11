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
import { CalendarIcon, Edit, MoreVertical, Plus, Trash, X } from 'lucide-react'
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

export default function Order() {
    const { user } = useUser();
    
    const [orders, setOrders] = useState<Purchase[]>([])
    const [isDialogOpen, setDialogOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<Purchase>({
        id: '',
        date: new Date(),
        delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
        user_id: user ? user.id : '',
        supplier: '',
        product: '',
        quantity: 0,
        value: 0,
        status: Status.Aberta,
        department: '',
        observations: ''
    })

    const handleOpenDialog = (order: Purchase | null = null) => {
        setCurrentOrder(order || {
            id: '',
            date: new Date(),
            delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
            user_id: user ? user.id : '',
            supplier: '',
            product: '',
            quantity: 0,
            value: 0,
            status: Status.Aberta,
            department: '',
            observations: ''
        })
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        setCurrentOrder({
            id: '',
            date: new Date(),
            delivery_date: new Date(new Date().setDate(new Date().getDate() + 1)),
            user_id: user ? user.id : '',
            supplier: '',
            product: '',
            quantity: 0,
            value: 0,
            status: Status.Aberta,
            department: '',
            observations: ''
        })
        setDialogOpen(false)
    }

    const handleOpenAlertDialog = (order: Purchase) => {
        setCurrentOrder(order)
        setIsAlertDialogOpen(true)
    }

    const handleDeleteOrder = async () => {
        setIsDeleting(true)
        try {
            const response = await fetch('/api/purchases', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: currentOrder.id })
            })

            if (!response.ok) {
                throw new Error('Erro ao deletar a ordem: ' + response.statusText)
            }

            const data = await response.json()
            setOrders(prevOrders => prevOrders.filter(order => order.id !== data.id));
            toast.success(data.message, {
                // description: "Clique aqui se deseja restaurar a ordem",
                // action: {
                    //   label: "Restaurar",
                    //   onClick: () => console.log("Restaurar"),
                // },
            })
            setIsAlertDialogOpen(false)
        } catch (error) {
            console.error(error)
            alert('Ocorreu um erro ao apagar a ordem. Tente novamente mais tarde: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true);

        if (currentOrder.department === null || currentOrder.department === '' || currentOrder.product === '' || currentOrder.quantity <= 0) {
            toast.error('Preencha todos os campos corretamente')
            setIsSubmitting(false)
            return
        }

        const newOrder: Purchase = {
            id: currentOrder.id !== '' ? currentOrder.id : uuidv4(),
            date: currentOrder.id !== '' ? currentOrder.date : new Date(),
            user_id: user ? user.id : '',
            supplier: currentOrder.supplier,
            status: currentOrder.id !== '' ? currentOrder.status : Status.Aberta,
            value: currentOrder.value,
            delivery_date: currentOrder.delivery_date,
            product: currentOrder.product,
            quantity: currentOrder.quantity,
            department: currentOrder.department,
            observations: currentOrder.observations
        }

        try {
            const method = currentOrder.id ? 'PUT' : 'POST';
            const response = await fetch('/api/purchases', {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            })

            if (!response.ok) {
                throw new Error('Erro ao salvar a ordem: ' + response.statusText);
            }

            const data = await response.json();
            if (currentOrder.id) {
                setOrders(prevOrders => prevOrders.map(order => order.id === data.id ? data : order));
            } else {
                setOrders(prevOrders => [...prevOrders, data]);
            }
            handleCloseDialog()
        } catch (error) {
            console.error('Erro ao salvar a ordem: ', error)
            alert('Ocorreu um erro ao salvar a ordem. Tente novamente mais tarde: ' + error)
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true)
            try {
                const response = await fetch('/api/purchases?page=order', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                })

                if (!response.ok) {
                    throw new Error('Erro ao buscar ordens: ' + response.statusText)
                }

                const data = await response.json()
                setOrders(data)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, []);

    return (
        <div className="p-4 sm:p-6 bg-background min-h-screen h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold select-none sm:text-lg">Ordens de Compra</h1>
                <Button 
                    onClick={() => handleOpenDialog()} 
                    className="bg-blue-500 text-white hover:bg-blue-600"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block ml-2">Adicionar Ordem</span>
                </Button>
            </div>
            <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                <TableCaption className="select-none">{orders.length > 0 || isLoading ? 'Uma lista das suas ordens de compra.' : 'Nenhum registro por aqui...'}</TableCaption>
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
                            <TableRow key={order.id} className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
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
                                            <DropdownMenuItem onClick={() => handleOpenDialog(order)}>
                                                <Edit className="h-3 w-3 mr-2" /> Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-400 hover:text-red-500" onClick={() => handleOpenAlertDialog(order)}>
                                                <Trash className="h-3 w-3 mr-2" /> Apagar
                                            </DropdownMenuItem>                                            
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação é irreversível e irá deletar a ordem permanentemente.
                                                    <br />
                                                    Produto: { currentOrder.product }
                                                    <br />
                                                    Setor: { currentOrder.department }
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
                                                    {isDeleting ? 'Apagando...' : <><Trash className="h-3 w-3 mr-2" /> Apagar</>}
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

            <div className="flex justify-center items-center rounded-lg">
                <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                    <DialogContent className="max-w-[350px] max-h-[450px] sm:max-w-[425px] sm:max-h-[720px] lg:max-h-none">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-base">{currentOrder.id !== '' ? 'Editar Ordem' : 'Adicionar Ordem'}</DialogTitle>
                            <DialogDescription className="text-sm sm:text-base">{currentOrder.id !== '' ? 'Faça alterações na ordem aqui. Clique em salvar quando terminar.' : 'Adicione uma nova ordem.'}</DialogDescription>
                        </DialogHeader> 
                        <form onSubmit={handleSubmit} className="space-y-4 max-h-64 sm:max-h-72 lg:max-h-80 xl:max-h-96 2xl:max-h-none overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Previsão de Entrega (Obrigatório)</label>
                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"secondary"}
                                            className={cn(
                                                "justify-start text-left font-normal w-full mt-1",
                                                !currentOrder.delivery_date && "text-muted-foreground"
                                            )}
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
                                    onChange={(value) => {
                                        setCurrentOrder({ ...currentOrder, department: value })
                                        console.log(currentOrder.department)
                                    }} 
                                    className="mt-1 w-full rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Fornecedor</label>
                                <input 
                                    type="text" 
                                    value={currentOrder.supplier || ''} 
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, supplier: e.target.value })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    // required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Produto (Obrigatório)</label>
                                <input 
                                    type="text"
                                    value={currentOrder.product}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, product: e.target.value })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Quantidade (Obrigatório)</label>
                                <input 
                                    type="number" 
                                    value={currentOrder.quantity}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, quantity: Number(e.target.value) })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Valor</label>
                                <input 
                                    type="number" 
                                    value={currentOrder.value || ''}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, value: Number(e.target.value) })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                    // required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Observações</label>
                                <Textarea
                                    value={currentOrder.observations || ''}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, observations: e.target.value })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <DialogFooter>
                                <Button 
                                    type="submit"
                                    className={`bg-green-500 text-white hover:bg-green-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Salvando...' : currentOrder.id !== '' ? 'Salvar Alterações' : 'Adicionar Ordem'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}