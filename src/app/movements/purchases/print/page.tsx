"use client"

import { useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon, Printer, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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
import NotFound from "@/components/NotFound"
import Loader from "@/components/ui/loader"
import { useReactToPrint } from "react-to-print"
import { formatZero } from "@/utils"
import { useUser } from "@/contexts/UserContext"
import html2pdf from 'js-html2pdf'

export default function PrintPurchasePage() {
    const { back } = useRouter()
    const { theme, setTheme } = useTheme()

    const { companySelected } = useUser()

    const {
        isLoading,
        currentPage,
        currentPurchase,
        clearPurchase
    } = usePurchase()

    let actualThemeMode: string = ''

    const printRef = useRef(null)
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: companySelected?.cnpj + '.O.C.' + formatZero(currentPurchase.sequence, 6),
        print: async (printIFrame) => {
            const document = printIFrame.contentDocument

            if (document) {
                const print = document.getElementById('print')
                const options = {
                    margin: 0,
                    filename: companySelected?.cnpj + '.O.C.' + formatZero(currentPurchase.sequence, 6),
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas:  {
                        scale: 1,
                        logging: true,
                        dpi: 192,
                        letterRendering: true,
                    },
                    jsPDF: {
                        orientation: 'portrait',
                        unit: 'mm',
                        format: [210, 297],
                    },
                }

                const exporter = new html2pdf(print, options)
                await exporter.getPdf(options)
            } else {
                toast.error('Erro ao gerar: Documento não encontrado.')
            }
        },
        onBeforePrint: async () => {
            actualThemeMode = theme ? theme : ''
            if (theme === 'dark') {
                setTheme('light')
            }
            toast.success('Gerando documento...')
        },
        onAfterPrint: () => {
            if (actualThemeMode !== '') {
                setTheme(actualThemeMode)
            }
            toast.success('Ordem gerada com sucesso!')
        },
        onPrintError: (location, error) => {
            toast.error('Error in ' + location + ': ' + error)
        }
    })

    return (
        <>
            <div className="pt-4 pl-4 pr-4 sm:pt-6 sm:pl-6 sm:pr-6 bg-background h-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl sm:text-lg">
                        {currentPage === 'order' ? 'Salvar Ordem' : 'Salvar Orçamento'}
                    </h1>
                    
                    <div className="flex items-center justify-center gap-4">
                        <Button
                            disabled={isLoading}
                            type="button"
                            className={`bg-destructive text-destructive-foreground hover:bg-destructive/80 w-14 sm:w-32`}
                            onClick={() => {
                                clearPurchase()
                                back()
                            }}
                        >
                            <X className="w-5 h-5" />
                            <span className="hidden sm:block ml-2">Fechar</span>
                        </Button>
                        <Button 
                            disabled={isLoading}
                            type="button"
                            className={`bg-green-600 text-white hover:bg-green-700 w-14 sm:w-36`}
                            onClick={() => handlePrint()}
                        >
                            <Printer className="w-5 h-5" />
                            <span className="hidden sm:block ml-2">Salvar</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-6 bg-background h-full" ref={printRef} id="print">
                <div className="flex flex-row justify-between">
                    <h1 className="text-lg sm:text-xl font-bold">{companySelected?.fantasy ? companySelected?.fantasy : companySelected?.name}</h1>
                    <h1 className="text-lg sm:text-xl font-bold">CNPJ: {companySelected?.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}</h1>
                </div>
                <div className="flex flex-row justify-between mb-4">
                    <h1 className="text-base sm:text-lg font-normal">{companySelected?.address} - {companySelected?.city} - {companySelected?.state}</h1>
                    <h1 className="text-base sm:text-lg font-normal">Telefone: {companySelected?.phone}</h1>
                </div>
                <div className="w-full border-b border-border mb-4" />
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="w-full select-none">
                        <label className="block text-sm font-medium cursor-not-allowed text-muted-foreground">N° da Ordem</label>
                        <h1 className="text-xl sm:text-lg mt-1">{formatZero(currentPurchase.sequence, 6)}</h1>
                    </div>
                    <div className="w-full select-none">
                        <label className="block text-sm font-medium  text-muted-foreground">Data</label>
                        <div
                            className={cn(
                                "flex flex-row justify-start items-center text-left font-normal w-full mt-1",
                                !currentPurchase.date && "text-muted-foreground"
                            )}
                        >
                            {/* <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                            <h1 className="text-lg">{currentPurchase.date ? new Date(currentPurchase.date).toLocaleDateString('pt-BR') : <span>Nenhuma data selecionada</span>}</h1>
                        </div>
                    </div>
                    <div className="w-full select-none">
                        <label className="block text-sm font-medium text-muted-foreground">Previsão</label>
                        <div
                            className={cn(
                                "flex flex-row justify-start items-center text-left font-normal w-full mt-1",
                                !currentPurchase.delivery_date && "text-muted-foreground"
                            )}
                        >
                            {/* <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" /> */}
                            <h1 className="text-lg">{currentPurchase.delivery_date ? new Date(currentPurchase.delivery_date).toLocaleDateString('pt-BR') : <span>Nenhuma previsão selecionada</span>}</h1>
                        </div>
                    </div>                            
                    <div className="w-full select-none">
                        <label className="block text-sm font-medium  text-muted-foreground">Setor</label>
                        <h1 className="text-xl sm:text-lg mt-1">{currentPurchase.department || 'Nenhum setor selecionado'}</h1>
                    </div>
                    <div className="w-full select-none">
                        <label className="block text-sm font-medium  text-muted-foreground">Fornecedor</label>
                        <h1 className="text-xl sm:text-lg mt-1">{currentPurchase.supplier || 'Nenhum fornecedor selecionado'}</h1>
                    </div>
                </div>

                <div className="mt-6">
                    {   isLoading ?
                            <Loader />
                        :
                        currentPurchase.items.length === 0 ?
                            <NotFound
                                title='Nenhum item encontrado.'
                            />
                        :
                            <Table className="min-w-full bg-background shadow-md rounded-lg overflow-hidden">
                                <TableCaption className="select-none">Itens da sua ordem de compra.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead hidden className="sm:w-[120px] select-none text-muted-foreground">ID</TableHead>
                                        <TableHead className="select-none text-muted-foreground">Produto</TableHead>
                                        <TableHead className="w-[80px] sm:w-[120px] text-center select-none text-muted-foreground">Quant.</TableHead>
                                        <TableHead className="w-[100px] sm:w-[150px] text-center select-none text-muted-foreground">V. Unit.</TableHead>
                                        <TableHead className="w-[100px] sm:w-[150px] text-right select-none text-muted-foreground">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {   currentPurchase.items.length > 0 &&
                                        currentPurchase.items.map((item) => {
                                            return (
                                                <TableRow key={item.id} className="h-[120px] sm:h-[80px] border-b hover:bg-gray-50 hover:dark:bg-gray-800">
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
                                    </TableRow>
                                </TableFooter>
                            </Table>
                    }
                </div>
            </div>
        </>
    );
}