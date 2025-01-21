"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/ui/combobox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Purchase, PurchaseItems, Status } from "@prisma/client"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Edit, MoreVertical,  PackageX, Plus, Save, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import FetchAPI from "@/utils/fetch-api"
import { v4 as uuidv4 } from "uuid"
import { usePurchase } from "@/contexts/PurchaseContext"
import {
    Table,
    TableCaption,
    TableHeader,
    TableHead,
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogHeader,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import NotFound from "@/components/NotFound"
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogHeader,
    AlertDialogDescription,
    AlertDialogCancel
} from "@/components/ui/alert-dialog"
import Loader from "@/components/ui/loader"
import { formatZero } from "@/utils"

export default function NewPurchasePage() {
    const { back } = useRouter()

    const {
        isLoading,
        currentMode,
        currentPage,
        currentPurchase,
        setPurchase,
        clearPurchase
    } = usePurchase()
    const { user, companySelected } = useUser()
    
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<PurchaseItems | null>(null)

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isVisualize = currentMode === 'visualize'

    const handleSaveItem = async () => {
        if (!selectedItem || selectedItem.product === '' || selectedItem.quantity === 0 || selectedItem.unitPrice === 0) {
            toast.error('Preencha todos os campos corretamente')
            return
        }

        let newItem: PurchaseItems
        let items: PurchaseItems[]
        if (selectedItem.id === '') {
            newItem = { ...selectedItem, id: String(currentPurchase.items.length + 1), total: (selectedItem.unitPrice * selectedItem.quantity) }
            items = [...currentPurchase.items, newItem]
        } else {
            newItem = { ...selectedItem, total: (selectedItem.unitPrice * selectedItem.quantity) }
            items = [...currentPurchase.items.filter(item => item.id !== selectedItem.id), newItem]
        }

        try {
            setPurchase({ ...currentPurchase, items })
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Erro ao salvar o item: ', error)
            toast.error('Ocorreu um erro ao salvar o item: ' + error)
        }
    }

    const handleOpenDialog = (item: PurchaseItems) => {
        setSelectedItem(item)
        setIsDialogOpen(true)
    }

    const handleOpenAlertDialog = (item: PurchaseItems) => {
        if (item.id === '') {
            toast.error('Nenhum item selecionado')
            return
        }

        setSelectedItem(item)
        setIsAlertDialogOpen(true)
    }

    const handleDeleteItem = async () => {
        setIsDeleting(true)

        if (selectedItem) {
            const items = currentPurchase.items.filter(item => item.id !== selectedItem.id)
            setPurchase({ ...currentPurchase, items })
        } else {
            toast.error('Nenhum item selecionado')
        }
        setIsAlertDialogOpen(false)
        setIsDeleting(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!currentPurchase) return

        if (currentPurchase.supplier === null || currentPurchase.supplier === '' || currentPurchase.items.length === 0 || currentPurchase.department === null || currentPurchase.department === '') {
            toast.error('Preencha todos os campos corretamente')
            setIsSubmitting(false)
            return
        }

        const newOrderId = currentPurchase.id !== '' ? currentPurchase.id : uuidv4()
        const totalValue = currentPurchase.items.reduce((total, purchaseItem) => total + (purchaseItem.quantity * purchaseItem.unitPrice), 0)

        const newOrder: Purchase & { items: PurchaseItems[] } = {
            id: newOrderId,
            sequence: currentPurchase.id !== '' ? currentPurchase.sequence : 0,
            companyId: companySelected ? companySelected.id : '',
            user_id: user ? user.id : '',
            date: currentPurchase.date ? currentPurchase.date : new Date(),
            delivery_date: currentPurchase.delivery_date,
            supplier: currentPurchase.supplier,
            total_value: totalValue,
            status: currentPurchase.id !== '' ? currentPurchase.status : currentPage === 'order' ? Status.Recebida : Status.Aberta,
            department: currentPurchase.department,
            observations: currentPurchase.observations,
            updated_at: new Date(),
            items: currentPurchase.items.map(item => ({
                id: item.id,
                purchaseId: newOrderId,
                product: item.product,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
                updated_at: item.updated_at
            }))
        }

        try {
            const method = currentPurchase.id ? 'PUT' : 'POST'
            
            const response = await FetchAPI({
                URL: '/api/purchases',
                method,
                body: JSON.stringify(newOrder)
            })

            if (!response.ok) {
                throw new Error(`Erro ao salvar ${currentPage === 'order' ? 'a ordem' : 'o orçamento'}: ${response.statusText}`)
            } else {
                toast.success(`${currentPage === 'order' ? 'Ordem salva' : 'Orçamento salvo'} com sucesso`)
                clearPurchase()
                back()
            }
        } catch (error) {
            console.error(`Erro ao salvar ${currentPage === 'order' ? 'a ordem' : 'o orçamento'}: ${error}`)
            toast.error(`Ocorreu um erro ao salvar ${currentPage === 'order' ? 'a ordem' : 'o orçamento'}: ${error}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="p-4 sm:p-6 bg-background h-full">
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl sm:text-lg">
                        {
                            isVisualize ?
                                `Visualizar ${currentPage === 'order' ? 'Ordem' : 'Orçamento'}` : 
                            currentPurchase && currentPurchase.id !== '' ?
                                `Editar ${currentPage === 'order' ? 'Ordem' : 'Orçamento'}` :
                                `Adicionar ${currentPage === 'order' ? 'Ordem' : 'Orçamento'}`
                        }
                    </h1>

                    {   isVisualize ? 
                        <Button
                            type="button"
                            className="bg-primary text-white hover:bg-primary/80"
                            onClick={() => {
                                clearPurchase()
                                back()
                            }}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Fechar
                        </Button>
                        :
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                type="button"
                                className={`bg-destructive text-destructive-foreground hover:bg-destructive/80 w-14 sm:w-32`}
                                disabled={isSubmitting}
                                onClick={() => {
                                    clearPurchase()
                                    back()
                                }}
                            >
                                <X className="w-5 h-5" />
                                <span className="hidden sm:block ml-2">Cancelar</span>
                            </Button>
                            <Button 
                                type="submit"
                                className={`bg-green-600 text-white hover:bg-green-700 w-14 sm:w-36 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                <Save className="w-5 h-5 " />
                                <span className="hidden sm:block ml-2">{isSubmitting ? 'Salvando...' : 'Salvar'}</span>
                            </Button>
                        </div>
                        
                    }
                </div>
            
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="w-full">
                        <label className="block text-sm font-medium cursor-not-allowed text-gray-700 dark:text-zinc-400">N° da Ordem</label>
                        <input 
                            type="text" 
                            value={String(formatZero(currentPurchase.sequence, 6)) || ''} 
                            // onChange={(e) => setPurchase({ ...currentPurchase, supplier: e.target.value })}
                            className={cn("mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary cursor-not-allowed")}
                            // required
                            disabled
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Data</label>
                        {/* <Popover open={false} onOpenChange={() => {}}>
                            <PopoverTrigger asChild> */}
                                <Button
                                    variant={"secondary"}
                                    className={cn(
                                        "cursor-not-allowed justify-start text-left font-normal w-full mt-1 select-none",
                                        !currentPurchase.date && "text-muted-foreground"
                                    )}
                                    disabled
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {currentPurchase.date ? new Date(currentPurchase.date).toLocaleDateString('pt-BR') : <span>Selecione data do cadastro</span>}
                                </Button>
                            {/* </PopoverTrigger>
                            <PopoverContent className="p-0 w-full">
                                <Calendar
                                    mode="single"
                                    selected={new Date(currentPurchase.delivery_date)}
                                    onSelect={(date) => setPurchase({ ...currentPurchase, delivery_date: date || new Date() })}
                                    initialFocus
                                    locale={ptBR}
                                    title="Selecione a data de entrega"
                                    onDayClick={() => setIsPopoverOpen(false)}
                                    required
                                />
                            </PopoverContent>
                        </Popover> */}
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Previsão</label>
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"secondary"}
                                    className={cn(
                                        "justify-start text-left font-normal w-full mt-1 select-none",
                                        !currentPurchase.delivery_date && "text-muted-foreground",
                                        isVisualize && 'cursor-not-allowed'
                                    )}
                                    disabled={isVisualize}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {currentPurchase.delivery_date ? new Date(currentPurchase.delivery_date).toLocaleDateString('pt-BR') : <span>Selecione a previsão de entrega</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-full">
                                <Calendar
                                    mode="single"
                                    selected={new Date(currentPurchase.delivery_date)}
                                    onSelect={(date) => setPurchase({ ...currentPurchase, delivery_date: date || new Date() })}
                                    initialFocus
                                    locale={ptBR}
                                    title="Selecione a data de entrega"
                                    onDayClick={() => setIsPopoverOpen(false)}
                                    required
                                />
                            </PopoverContent>
                        </Popover>
                    </div>                            
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Setor</label>
                        <Combobox
                            defaultTitle='Selecione o setor...'
                            defaultComandEmpty='Nenhum setor encontrado.'
                            defaultComandPlaceHolder='Pesquise o setor...'
                            items={[
                                { value: 'Compras', label: 'Compras' },
                                { value: 'Financeiro', label: 'Financeiro' },
                                { value: 'RH', label: 'RH' },
                                { value: 'TI', label: 'TI' },
                                { value: 'Vendas', label: 'Vendas' }
                            ]}
                            value={currentPurchase.department || ''}
                            className={cn("mt-1 w-full rounded-md shadow-sm p-2 min-w-36", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                            onChange={(value) => {
                                if (isVisualize) {
                                    toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                } else {
                                    setPurchase({ ...currentPurchase, department: value })
                                }
                            }} 
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Fornecedor</label>
                        <input 
                            type="text" 
                            value={currentPurchase.supplier || ''} 
                            onChange={(e) => setPurchase({ ...currentPurchase, supplier: e.target.value })} 
                            className={cn("mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary", isVisualize && 'cursor-not-allowed')}
                            required
                            disabled={isVisualize}
                        />
                    </div>
                    {/* <div className="min-w-44">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Observações</label>
                        <Textarea
                            value={currentPurchase.observations || ''}
                            onChange={(e) => setPurchase({ ...currentPurchase, observations: e.target.value })} 
                            className={cn("mt-[2px] block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-foreground focus:border-foreground", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                        />
                    </div> */}
                    <Button type={"button"} disabled={isVisualize} className="mt-6 ml-auto disabled:hidden" onClick={() => {
                        setSelectedItem({
                            id: '',
                            purchaseId: currentPurchase.id,
                            product: '',
                            quantity: 0,
                            unitPrice: 0,
                            total: 0,
                            updated_at: new Date()
                        })
                        setIsDialogOpen(true)
                    }}>
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:block ml-2">Adicionar Item</span>
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                {   isLoading ?
                        <Loader />
                    :
                    currentPurchase.items.length === 0 ?
                        <NotFound
                            title='Nenhum item encontrado. Clique em "adicionar" para inserir um novo item.'
                        />
                    :
                        <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                            <TableCaption className="select-none">Itens da sua ordem de compra.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead hidden className="sm:w-[120px] select-none">ID</TableHead>
                                    <TableHead className="select-none">Produto</TableHead>
                                    <TableHead className="w-[80px] sm:w-[120px] text-center select-none">Quant.</TableHead>
                                    <TableHead className="w-[100px] sm:w-[150px] text-center select-none">V. Unit.</TableHead>
                                    <TableHead className="w-[100px] sm:w-[150px] text-right select-none">Total</TableHead>
                                    <TableHead className="w-[35px] sm:w-[50px] text-right select-none">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {   currentPurchase.items.length > 0 &&
                                    currentPurchase.items.map((item) => {
                                        return (
                                            <TableRow key={item.id} onDoubleClick={() => {}} className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
                                                <TableCell hidden className="sm:w-[120px] select-none">{item.id}</TableCell>
                                                <TableCell className="select-none text-sm sm:text-base">{item.product}</TableCell>
                                                <TableCell className="w-[80px] sm:w-[120px] text-center select-none text-sm sm:text-base">{item.quantity}</TableCell>
                                                <TableCell className="w-[100px] sm:w-[150px] text-center select-none text-sm sm:text-base">
                                                    {Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }).format(item.unitPrice)}
                                                </TableCell>
                                                <TableCell className="w-[100px] sm:w-[150px] text-right select-none text-sm sm:text-base">
                                                    {Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }).format(item.total)}
                                                </TableCell>
                                                <TableCell className="w-[35px] sm:w-[50px] text-right select-none">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button 
                                                                variant={"secondary"}
                                                                size={"icon"}
                                                                disabled={isVisualize}
                                                                className="disabled:cursor-not-allowed"
                                                            >
                                                                <MoreVertical className="h-3 w-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                                                                <Edit className="h-3 w-3 mr-2" /> Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-400 hover:text-red-500" onClick={() => handleOpenAlertDialog(item)}>
                                                                <PackageX className="h-3 w-3 mr-2" /> Remover
                                                            </DropdownMenuItem>                                            
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Deseja remover o item da ordem de compra?
                                                                    { selectedItem?.product && <><br />Produto: {selectedItem.product}</> }
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                                                                    <X className="h-3 w-3" />
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className={`bg-red-500 text-white hover:bg-red-600 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                    onClick={() => handleDeleteItem()}
                                                                    disabled={isDeleting}
                                                                >
                                                                    <PackageX className="h-3 w-3 mr-2" /> {isDeleting ? 'Removendo...' : 'Remover'}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} className="select-none text-base font-bold">Total</TableCell>
                                    <TableCell className="w-[100px] sm:w-[150px] text-right select-none text-base font-bold">
                                        {Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(currentPurchase.items.reduce((total, purchaseItem) => {
                                            return total + (purchaseItem.total || 0)
                                        }, 0))}
                                    </TableCell>
                                    <TableCell className="w-[35px] sm:w-[50px] text-right select-none" />
                                </TableRow>
                            </TableFooter>
                        </Table>
                }
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedItem?.id !== '' ? "Editar Item" : "Adicionar Item"}</DialogTitle>
                        <DialogDescription>
                            {selectedItem?.id !== '' ? "Edite os detalhes do item." : "Adicione um novo item."}
                        </DialogDescription>
                    </DialogHeader>
                    {   selectedItem && (
                        <div className="space-y-4 max-h-64 sm:max-h-72 lg:max-h-80 xl:max-h-96 2xl:max-h-none overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Produto</label>
                                <input 
                                    type="text"
                                    value={selectedItem?.product || ''}
                                    onChange={(e) => setSelectedItem({
                                        product: e.target.value, 
                                        id: selectedItem?.id || '',
                                        updated_at: selectedItem?.updated_at || new Date(),
                                        purchaseId: selectedItem?.purchaseId || '',
                                        quantity: selectedItem?.quantity || 0,
                                        unitPrice: selectedItem?.unitPrice || 0,
                                        total: selectedItem?.total || 0
                                    })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                    required
                                    // disabled={visualize}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Quantidade</label>
                                <input 
                                    type="number" 
                                    value={selectedItem?.quantity || 0}
                                    onChange={(e) => setSelectedItem({
                                        quantity: Number(e.target.value),
                                        id: selectedItem?.id || '',
                                        updated_at: selectedItem?.updated_at || new Date(),
                                        purchaseId: selectedItem?.purchaseId || '',
                                        product: selectedItem?.product || '',
                                        unitPrice: selectedItem?.unitPrice || 0,
                                        total: selectedItem?.total || 0
                                    })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                    required
                                    // disabled={visualize}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Valor Unitário</label>
                                <input 
                                    type="number" 
                                    value={selectedItem?.unitPrice || 0}
                                    onChange={(e) => setSelectedItem({
                                        unitPrice: Number(e.target.value),
                                        id: selectedItem?.id || '',
                                        updated_at: selectedItem?.updated_at || new Date(),
                                        purchaseId: selectedItem?.purchaseId || '',
                                        product: selectedItem?.product || '',
                                        quantity: selectedItem?.quantity || 0,
                                        total: selectedItem?.total || 0
                                    })} 
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary"
                                    // required={propsDialog}
                                    // disabled={visualize}
                                />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancelar</Button>
                                </DialogClose>
                                <Button onClick={handleSaveItem}>{selectedItem?.id !== '' ? "Atualizar" : "Salvar"}</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}