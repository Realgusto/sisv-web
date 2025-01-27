"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/ui/combobox"
import { Service, StatusService } from "@prisma/client"
import { CalendarIcon, Save, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import FetchAPI from "@/utils/fetch-api"
import { v4 as uuidv4 } from "uuid"
import { useService } from "@/contexts/ServiceContext"
// import {
//     Table,
//     TableCaption,
//     TableHeader,
//     TableHead,
//     TableBody,
//     TableCell,
//     TableFooter,
//     TableRow,
// } from "@/components/ui/table"
// import {
//     Dialog,
//     DialogClose,
//     DialogHeader,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogTitle,
// } from "@/components/ui/dialog"
// import NotFound from "@/components/NotFound"
// import {
//     DropdownMenu,
//     DropdownMenuItem,
//     DropdownMenuContent,
//     DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu"
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogContent,
//     AlertDialogFooter,
//     AlertDialogTitle,
//     AlertDialogHeader,
//     AlertDialogDescription,
//     AlertDialogCancel
// } from "@/components/ui/alert-dialog"
// import Loader from "@/components/ui/loader"
import { formatZero } from "@/utils"
import { Textarea } from "@/components/ui/textarea"
import { itemsCriticality, itemsDepartment, itemsEquipment, itemsServiceType, statusEquipment } from "@/constants"

export default function NewServicePage() {
    const { back } = useRouter()

    const {
        currentMode,
        currentService,
        setService,
        clearService
    } = useService()
    const { user, companySelected } = useUser()
    
    // const [isDialogOpen, setIsDialogOpen] = useState(false)
    // const [selectedItem, setSelectedItem] = useState<PurchaseItems | null>(null)

    // const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    // const [isDeleting, setIsDeleting] = useState(false)

    // const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isVisualize = currentMode === 'visualize'

    // const handleSaveItem = async () => {
    //     if (!selectedItem || selectedItem.product === '' || selectedItem.quantity === 0 || selectedItem.unitPrice === 0) {
    //         toast.error('Preencha todos os campos corretamente')
    //         return
    //     }

    //     let newItem: PurchaseItems
    //     let items: PurchaseItems[]
    //     if (selectedItem.id === '') {
    //         newItem = { ...selectedItem, id: String(currentPurchase.items.length + 1), total: (selectedItem.unitPrice * selectedItem.quantity) }
    //         items = [...currentPurchase.items, newItem]
    //     } else {
    //         newItem = { ...selectedItem, total: (selectedItem.unitPrice * selectedItem.quantity) }
    //         items = [...currentPurchase.items.filter(item => item.id !== selectedItem.id), newItem]
    //     }

    //     try {
    //         setPurchase({ ...currentPurchase, items })
    //         setIsDialogOpen(false)
    //     } catch (error) {
    //         console.error('Erro ao salvar o item: ', error)
    //         toast.error('Ocorreu um erro ao salvar o item: ' + error)
    //     }
    // }

    // const handleOpenDialog = (item: PurchaseItems) => {
    //     setSelectedItem(item)
    //     setIsDialogOpen(true)
    // }

    // const handleOpenAlertDialog = (item: PurchaseItems) => {
    //     if (item.id === '') {
    //         toast.error('Nenhum item selecionado')
    //         return
    //     }

    //     setSelectedItem(item)
    //     setIsAlertDialogOpen(true)
    // }

    // const handleDeleteItem = async () => {
    //     setIsDeleting(true)

    //     if (selectedItem) {
    //         const items = currentPurchase.items.filter(item => item.id !== selectedItem.id)
    //         setPurchase({ ...currentPurchase, items })
    //     } else {
    //         toast.error('Nenhum item selecionado')
    //     }
    //     setIsAlertDialogOpen(false)
    //     setIsDeleting(false)
    // }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!currentService) return

        if (currentService.department === null || currentService.department === '' || currentService.equipment === null || currentService.equipment === '' || currentService.criticality === null || currentService.criticality === '') {
            toast.error('Preencha todos os campos corretamente')
            setIsSubmitting(false)
            return
        }

        const newServiceId = currentService.id !== '' ? currentService.id : uuidv4()
        const newSequence = currentService.id !== '' ? currentService.sequence : 0

        const newService: Service = {
            id: newServiceId,
            sequence: newSequence,
            companyId: companySelected ? companySelected.id : '',
            user_id: user ? user.id : '',
            service_user_id: null,
            approval_user_id: null,
            date: currentService.date ? currentService.date : new Date(),
            end_date: currentService.end_date,
            department: currentService.department,
            equipment: currentService.equipment,
            status: currentService.id !== '' ? currentService.status : StatusService.Aberta,
            criticality: currentService.criticality,
            equipment_status: null,
            service_type: null,
            service_description: null,
            observations: currentService.observations,
            updated_at: new Date(),
        }

        try {
            const method = currentService.id ? 'PUT' : 'POST'
            
            const response = await FetchAPI({
                URL: '/api/services',
                method,
                body: JSON.stringify(newService)
            })

            if (!response.ok) {
                throw new Error(`Erro ao salvar a ordem de serviço: ${response.statusText}`)
            } else {
                toast.success(`Ordem de serviço salva com sucesso`)
                clearService()
                back()
            }
        } catch (error) {
            console.error(`Erro ao salvar a ordem de serviço: ${error}`)
            toast.error(`Ocorreu um erro ao salvar a ordem de serviço: ${error}`)
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
                                `Visualizar Ordem` : 
                            currentService && currentService.id !== '' ?
                                `Editar Ordem` :
                                `Adicionar Ordem`
                        }
                    </h1>

                    {   isVisualize ? 
                        <Button
                            type="button"
                            className="bg-primary text-white hover:bg-primary/80"
                            onClick={() => {
                                clearService()
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
                                    clearService()
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
                            value={String(formatZero(currentService.sequence, 6)) || ''}
                            className={cn("mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary cursor-not-allowed")}
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
                                        !currentService.date && "text-muted-foreground"
                                    )}
                                    disabled
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {currentService.date ? new Date(currentService.date).toLocaleDateString('pt-BR') : <span>Selecione data do cadastro</span>}
                                </Button>
                            {/* </PopoverTrigger>
                            <PopoverContent className="p-0 w-full">
                                <Calendar
                                    mode="single"
                                    selected={new Date(currentService.date)}
                                    onSelect={(date) => setService({ ...currentService, date: date || new Date() })}
                                    initialFocus
                                    locale={ptBR}
                                    title="Selecione a data de cadastro"
                                    onDayClick={() => setIsPopoverOpen(false)}
                                    required
                                />
                            </PopoverContent>
                        </Popover> */}
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Data de Finalização</label>
                        {/* <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild> */}
                                <Button
                                    variant={"secondary"}
                                    className={cn(
                                        "justify-start text-left font-normal w-full mt-1 select-none",
                                        !currentService.end_date && "text-muted-foreground",
                                        isVisualize && 'cursor-not-allowed'
                                    )}
                                    disabled
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {currentService.status === StatusService.Concluida && currentService.end_date ? new Date(currentService.end_date).toLocaleDateString('pt-BR') : <span>O.S não finalizada</span>}
                                </Button>
                            {/* </PopoverTrigger>
                            <PopoverContent className="p-0 w-full">
                                <Calendar
                                    mode="single"
                                    selected={currentService.end_date ? new Date(currentService.end_date) : new Date(new Date().setDate(new Date().getDate() + 1))}
                                    onSelect={(date) => setService({ ...currentService, end_date: date || new Date() })}
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Setor</label>
                        <Combobox
                            defaultTitle='Selecione o setor...'
                            defaultComandEmpty='Nenhum setor encontrado.'
                            defaultComandPlaceHolder='Pesquise o setor...'
                            items={itemsDepartment}
                            value={currentService.department || ''}
                            className={cn("mt-1 w-full rounded-md shadow-sm p-2 min-w-36", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                            onChange={(value) => {
                                if (isVisualize) {
                                    toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                } else {
                                    setService({ ...currentService, department: value })
                                }
                            }} 
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Equipamento</label>
                        <Combobox
                            defaultTitle='Selecione o equipamento...'
                            defaultComandEmpty='Nenhum equipamento encontrado.'
                            defaultComandPlaceHolder='Pesquise o equipamento...'
                            items={itemsEquipment}
                            value={currentService.equipment || ''}
                            className={cn("mt-1 w-full rounded-md shadow-sm p-2 min-w-36", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                            onChange={(value) => {
                                if (isVisualize) {
                                    toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                } else {
                                    setService({ ...currentService, equipment: value })
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Criticidade</label>
                        <Combobox
                            defaultTitle='Selecione a criticidade...'
                            defaultComandEmpty='Nenhuma criticidade encontrada.'
                            defaultComandPlaceHolder='Pesquise a criticidade...'
                            items={itemsCriticality}
                            value={currentService.criticality || ''}
                            className={cn("mt-1 w-full rounded-md shadow-sm p-2 min-w-36", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                            onChange={(value) => {
                                if (isVisualize) {
                                    toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                } else {
                                    setService({ ...currentService, criticality: value })
                                }
                            }} 
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Status do Equipamento</label>
                        <Combobox
                            defaultTitle='Selecione o status do equipamento...'
                            defaultComandEmpty='Nenhum status do equipamento encontrado.'
                            defaultComandPlaceHolder='Pesquise o status do equipamento...'
                            items={statusEquipment}
                            value={currentService.equipment_status || ''}
                            className={cn("mt-1 w-full rounded-md shadow-sm p-2 min-w-36", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                            onChange={(value) => {
                                if (isVisualize) {
                                    toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                } else {
                                    setService({ ...currentService, equipment_status: value })
                                }
                            }} 
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Tipo de Serviço</label>
                        <Combobox
                            defaultTitle='Selecione o tipo de serviço...'
                            defaultComandEmpty='Nenhum tipo de serviço encontrado.'
                            defaultComandPlaceHolder='Pesquise o tipo de serviço...'
                            items={itemsServiceType}
                            value={currentService.service_type || ''}
                            className={cn("mt-1 w-full rounded-md shadow-sm p-2 min-w-36", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                            onChange={(value) => {
                                if (isVisualize) {
                                    toast.error('Para fazer alterações, saia do modo de visualização e entre no modo de edição clicando no botão "Editar"')
                                } else {
                                    setService({ ...currentService, service_type: value })
                                }
                            }} 
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Descrição do Serviço</label>
                        <Textarea
                            value={currentService.service_description || ''}
                            onChange={(e) => setService({ ...currentService, service_description: e.target.value })} 
                            className={cn("mt-[2px] block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-foreground focus:border-foreground", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-400">Observações</label>
                        <Textarea
                            value={currentService.observations || ''}
                            onChange={(e) => setService({ ...currentService, observations: e.target.value })} 
                            className={cn("mt-[2px] block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-foreground focus:border-foreground", isVisualize && 'cursor-not-allowed')}
                            disabled={isVisualize}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}