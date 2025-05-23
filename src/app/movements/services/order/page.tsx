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
    TableCell
} from '@/components/ui/table'
import {
    Edit,
    MoreVertical,
    OctagonAlert,
    PackageX,
    Plus,
    X,
    Clock,
    Cog,
    CalendarIcon
} from 'lucide-react'
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
import { Service, StatusService } from '@prisma/client'
import { useUser } from '@/contexts/UserContext'
import FetchAPI from '@/utils/fetch-api'
import CalendarDatePicker from '@/components/CalendarDatePicker'
import NotFound from '@/components/NotFound'
import { useRouter } from 'next/navigation'
import { useService } from '@/contexts/ServiceContext'
import { formatStatus, formatZero } from '@/utils'

export default function Services() {
    const { push } = useRouter()
    const { setMode, setService, currentService } = useService()
    const { user, companySelected } = useUser()
    
    const [date, setDate] = useState<Date>(new Date())

    const [services, setServices] = useState<Service[]>([])
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
    const [isAlertProgramOpen, setIsAlertProgramOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isProgram, setIsProgram] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleTreatment = (service: Service) => {
        if (!user) {
            toast.error('Usuário não encontrado')
            return
        }

        setMode('edit')
        setService({ ...service, status: StatusService.Em_andamento, service_user_id: user.id })
        push('/movements/services/new')
    }

    const handleOpenDialog = (service: Service | null = null) => {
        if (service) {
            setMode('edit')
            setService(service)
        } else {
            setMode('new')
            setService({
                id: '',
                sequence: 0,
                companyId: '',
                user_id: '',
                service_user_id: null,
                approval_user_id: null,
                date: new Date(),
                end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
                program_date: null,
                status: StatusService.Aberta,
                department: null,
                equipment: null,
                criticality: null,
                service_description: null,
                service_type: null,
                equipment_status: null,
                observations: null,
                updated_at: new Date(),
            })
        }
        push('/movements/services/new')
    }

    const handleItemDoubleClick = async (service: Service) => {
        setMode('visualize')
        setService(service)
        push('/movements/services/new')
    }

    const handleOpenAlertDialog = (service: Service) => {
        setService(service)
        setIsAlertDialogOpen(true)
    }

    const handleOpenAlertProgram = (service: Service) => {
        setService(service)
        setIsAlertProgramOpen(true)
    }

    const handleProgram = async () => {
        setIsProgram(true)
        try {
            const editService: Service = {
                id: currentService.id,
                sequence: currentService.sequence,
                companyId: currentService.companyId,
                user_id: currentService.user_id,
                service_user_id: currentService.service_user_id,
                approval_user_id: currentService.approval_user_id,
                date: currentService.date,
                end_date: currentService.end_date,
                program_date: date,
                department: currentService.department,
                equipment: currentService.equipment,
                status: currentService.status,
                criticality: currentService.criticality,
                equipment_status: currentService.equipment_status,
                service_type: currentService.service_type,
                service_description: currentService.service_description,
                observations: currentService.observations,
                updated_at: new Date(),
            }
            
            const response = await FetchAPI({
                URL: '/api/services',
                method: 'PUT',
                body: JSON.stringify( editService )
            })

            if (!response.ok) {
                throw new Error('Erro ao programar o serviço: ' + response.statusText)
            }

            // const data = await response.json()
            toast.success('Serviço programado com sucesso!')
            setIsAlertProgramOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Ocorreu um erro ao programar o serviço. Tente novamente mais tarde: ' + error)
        } finally {
            setIsProgram(false)
        }
    }

    const handleDeleteService = async () => {
        setIsDeleting(true)
        try {
            const response = await FetchAPI({
                URL: '/api/services',
                method: 'DELETE',
                body: JSON.stringify({
                    id: currentService?.id,
                    companyId: companySelected ?
                                    companySelected.id
                                    :
                                    ''
                })
            })

            if (!response.ok) {
                throw new Error('Erro ao cancelar o serviço: ' + response.statusText)
            }

            const data = await response.json()
            // const serviceAnt = services
            setServices(prevServices => prevServices.filter(service => service.id !== data.id));
            toast.success(data.message, {
                // description: "Clique aqui se deseja restaurar o serviço",
                // action: {
                //       label: "Restaurar",
                //       onClick: () => setServices(serviceAnt),
                // },
            })
            setIsAlertDialogOpen(false)
        } catch (error) {
            console.error(error)
            toast.error('Ocorreu um erro ao cancelar o serviço. Tente novamente mais tarde: ' + error)
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true)
            if (companySelected?.id) {
                try {
                    const response = await FetchAPI({
                        URL: '/api/services?companyId=' + companySelected.id,
                        method: 'GET'
                    })

                    if ((response.status !== 200) && (response.status !== 404)) {
                        throw new Error('Erro ao buscar serviços: ' + response.statusText)
                    } else if (response.status === 404) {
                        toast.error('Nenhum serviço encontrado')
                        setServices([])
                    } else {
                        const data = await response.json()
                        setServices(data)
                    }
                } catch (error) {
                    console.error(error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setServices([])
                setIsLoading(false)
            }
        }

        fetchServices()
    }, [companySelected?.id])

    return (
        <div className="p-4 sm:p-6 bg-background min-h-screen h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold select-none sm:text-lg">Ordens de Serviço</h1>
                {/* <CalendarDatePicker
                    Icon={<CalendarIcon className="mr-2 h-5 w-5" />}
                    defaultTitle="Selecione a data para visualizar os serviços"
                    selected={date}
                    onSelect={(dt) => setDate(dt ? dt : new Date())}
                    className="w-auto"
                /> */}
                <Button
                    onClick={() => handleOpenDialog()}
                    className="bg-primary text-white w-10 sm:w-36 hover:bg-primary/80"
                >
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:block ml-2">Serviço</span>
                </Button>
            </div>
            {   services.length === 0 && !isLoading ? 
                <NotFound title='Nenhum serviço encontrado. Para iniciar, clique no botão "Serviço" acima, e crie um novo serviço.' />
            :
                <>
                    <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                        <TableCaption className="select-none">Uma lista das suas ordens de serviço.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sm:w-[120px] select-none"><span className="ml-2">O.S</span></TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] select-none">Data</TableHead>
                                <TableHead className="w-[100px] sm:w-[120px] select-none">Setor</TableHead>
                                <TableHead className="select-none">Equipamento</TableHead>
                                <TableHead className="w-[80px] sm:w-[150px] select-none">Status</TableHead>
                                <TableHead className="w-[80px] sm:w-[150px] text-right select-none">Criticidade</TableHead>
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
                                services.map(service => (
                                    <TableRow key={service.id} onDoubleClick={() => handleItemDoubleClick(service)} className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
                                        <TableCell className="font-semibold text-xs sm:text-sm sm:w-[30px]"><span className="ml-2">{formatZero(service.sequence, 6)}</span></TableCell>
                                        <TableCell className="w-[100px] sm:w-[120px] text-xs sm:text-base select-none">{new Date(service.date).toLocaleDateString('pt-BR')}</TableCell>
                                        <TableCell className="w-[100px] sm:w-[120px] text-xs sm:text-base select-none">{service.department ? service.department : 'N . D'}</TableCell>
                                        <TableCell className="select-none text-xs sm:text-base">{service.equipment ? service.equipment : 'N . D'}</TableCell>
                                        <TableCell className="w-[80px] sm:w-[150px] select-none text-xs sm:text-base">{service.status ? formatStatus(service.status) : 'N . D'}</TableCell>
                                        <TableCell className="w-[80px] sm:w-[150px] text-right select-none text-xs sm:text-base font-bold">
                                            {service.criticality && service.criticality === 'high' ? 
                                                <div className="h-7 w-7 ml-auto mr-5 flex items-center justify-center bg-red-500 rounded-full">
                                                    <OctagonAlert className="h-5 w-5 text-white" />
                                                </div>
                                            : service.criticality && service.criticality === 'medium' ?
                                                <div className="h-7 w-7 ml-auto mr-5 flex items-center justify-center bg-yellow-500 rounded-full">
                                                    <OctagonAlert className="h-5 w-5 text-white" />
                                                </div>
                                            : service.criticality && service.criticality === 'low' &&
                                                <div className="h-7 w-7 ml-auto mr-5 flex items-center justify-center bg-green-500 rounded-full">
                                                    <Clock className="h-5 w-5 text-white" />
                                                </div>
                                            }
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
                                                    {   service.status === StatusService.Aberta ?
                                                            <DropdownMenuItem className="text-green-600" onClick={() => {
                                                                toast.info('Revise a ordem e preencha os dados.')
                                                                handleTreatment(service)
                                                            }}>
                                                                <Cog className="h-3 w-3 mr-2" /> Tratar
                                                            </DropdownMenuItem>
                                                        : service.status === StatusService.Programada &&
                                                            <DropdownMenuItem onClick={() => handleOpenAlertProgram(service)}>
                                                                <Clock className="h-3 w-3 mr-2" /> Programar
                                                            </DropdownMenuItem>
                                                    }
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(service)}>
                                                        <Edit className="h-3 w-3 mr-2" /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500" onClick={() => handleOpenAlertDialog(service)}>
                                                        <PackageX className="h-3 w-3 mr-2" /> Cancelar
                                                    </DropdownMenuItem>                                            
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Deseja cancelar a ordem de serviço?
                                                            { currentService?.equipment && <><br />Equipamento: {currentService.equipment}</> }
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                                                            <X className="h-3 w-3" />
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className={`bg-red-500 text-white hover:bg-red-600 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={() => handleDeleteService()}
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
                        {/* <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} className="select-none text-base font-bold">Total</TableCell>
                                <TableCell className="w-[80px] sm:w-[150px] text-right select-none text-base font-bold">
                                    {Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    }).format(services.reduce((total, service) => {
                                        if (service.status === StatusService.Concluida || service.status?.startsWith('Pedido')) {
                                            return total + (service.total_value || 0)
                                        }
                                        return total
                                    }, 0))}
                                </TableCell>
                                <TableCell className="w-[35px] sm:w-[50px] text-right select-none" />
                            </TableRow>
                        </TableFooter> */}
                    </Table>
                    <AlertDialog open={isAlertProgramOpen} onOpenChange={setIsAlertProgramOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Programar tratamento</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Escolha a melhor data para programar o tratamento.
                                    { currentService?.equipment && <><br />Equipamento: {currentService.equipment}</> }
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid my-4 h-14 bg-primary/25 rounded-lg">
                                <CalendarDatePicker
                                    className="w-full h-full"
                                    Icon={<CalendarIcon className="mr-2 h-5 w-5" />}
                                    defaultTitle="Selecione a data para programar o tratamento"
                                    selected={date}
                                    onSelect={(dt) => setDate(dt ? dt : new Date())}
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsAlertProgramOpen(false)}>
                                    <X className="h-3 w-3" />
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleProgram()}
                                    disabled={isProgram}
                                >
                                    <Clock className="h-3 w-3 mr-2" /> {isProgram ? 'Cancelando...' : 'Cancelar'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            }
        </div>
    );
}