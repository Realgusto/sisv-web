"use client"

import { useRouter } from "next/navigation"
import { usePurchase } from "@/contexts/PurchaseContext"
import NotFound from "@/components/NotFound"
import Loader from "@/components/ui/loader"
import { formatZero } from "@/utils"
import { useUser } from "@/contexts/UserContext"
import { Document, Page, Text, View, PDFViewer } from '@react-pdf/renderer'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import styles from "./styles"

export default function PrintPurchasePage() {
    const { back } = useRouter()
    const { companySelected } = useUser()

    const {
        isLoading,
        currentPage,
        currentPurchase,
        clearPurchase
    } = usePurchase()

    const handleBack = () => {
        back()
        clearPurchase()
    }

    return (
        <>
            <div className="p-4 sm:p-6 flex items-center">
                <Button className="bg-primary text-white w-10 sm:w-36 hover:bg-primary/80" onClick={handleBack}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="hidden sm:block ml-2">Voltar</span>
                </Button>
            </div>
            {   isLoading ?
                    <Loader />
                :
                !currentPurchase || currentPurchase.items.length === 0 ?
                    <NotFound
                        title='Nenhum documento encontrado.'
                    />
                :
                    <PDFViewer className="mt-1 w-full h-screen">
                        <Document
                            title={companySelected?.cnpj + '.O.C.' + formatZero(currentPurchase.sequence, 6)}
                            author={companySelected?.fantasy ? companySelected?.fantasy : companySelected?.name}
                            creator="4easy - SISV"
                            subject={currentPage === 'order' ? `Ordem de Compra ${formatZero(currentPurchase.sequence, 6)}` : `Orçamento de Compra ${formatZero(currentPurchase.sequence, 6)}`}
                        >
                            <Page size="A4" orientation="landscape" style={styles.page}>
                                <View style={[styles.header, { marginBottom: 5 }]}>
                                    <Text style={styles.headerCompany}>{companySelected?.fantasy ? companySelected?.fantasy : companySelected?.name}</Text>
                                    <Text style={styles.headerCompany}>CNPJ: {companySelected?.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')}</Text>
                                </View>
                                <View style={styles.header}>
                                    <Text style={styles.headerAddress}>{companySelected?.address} - {companySelected?.city} - {companySelected?.state}</Text>
                                    <Text style={styles.headerPhone}>Telefone: {companySelected?.phone}</Text>
                                </View>
                                <View style={[styles.header, { marginTop: 20 }]}>
                                    <View>
                                        <Text style={styles.headerTitle}>N° {currentPage === 'order' ? 'da Ordem' : 'do Orçamento'}</Text>
                                        <Text style={styles.headerText}>{formatZero(currentPurchase.sequence, 6)}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.headerTitle}>Data</Text>
                                        <Text style={styles.headerText}>{currentPurchase.date ? new Date(currentPurchase.date).toLocaleDateString('pt-BR') : <span>Nenhuma data selecionada</span>}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.headerTitle}>Previsão</Text>
                                        <Text style={styles.headerText}>{currentPurchase.delivery_date ? new Date(currentPurchase.delivery_date).toLocaleDateString('pt-BR') : <span>Nenhuma previsão selecionada</span>}</Text>
                                    </View>                            
                                    <View>
                                        <Text style={styles.headerTitle}>Setor</Text>
                                        <Text style={styles.headerText}>{currentPurchase.department || 'Nenhum setor selecionado'}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.headerTitle}>Fornecedor</Text>
                                        <Text style={styles.headerText}>{currentPurchase.supplier || 'Nenhum fornecedor selecionado'}</Text>
                                    </View>
                                </View>
                                <View style={styles.contentHeader}>
                                    <Text style={[styles.contentHeaderTitle, { width: '60%' }]}>Itens</Text>
                                    <Text style={[styles.contentHeaderTitle, { width: '13%', textAlign: 'center' }]}>Quant.</Text>
                                    <Text style={[styles.contentHeaderTitle, { width: '13%', textAlign: 'center' }]}>V. Unit.</Text>
                                    <Text style={[styles.contentHeaderTitle, { width: '14%', textAlign: 'right' }]}>Total</Text>
                                </View>
                                <View style={styles.border} />
                                <View style={styles.content}>
                                    {   currentPurchase.items.length > 0 &&
                                        currentPurchase.items.map((item) => {
                                            return (
                                                <View key={item.id} style={styles.contentItem}>
                                                    <Text style={[styles.contentItemText, { width: '60%' }]}>{item.product}</Text>
                                                    <Text style={[styles.contentItemText, { width: '13%', textAlign: 'center' }]}>{item.quantity}</Text>
                                                    <Text style={[styles.contentItemText, { width: '13%', textAlign: 'center' }]}>
                                                        {Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        }).format(item.unitPrice)}
                                                    </Text>
                                                    <Text style={[styles.contentItemText, { width: '14%', textAlign: 'right' }]}>
                                                        {Intl.NumberFormat('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        }).format(item.total)}
                                                    </Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <View style={styles.border} />
                                <View style={styles.contentFooter}>
                                    <Text style={styles.contentFooterText}>Total</Text>
                                    <Text style={styles.contentFooterText}>
                                        {Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        }).format(currentPurchase.items.reduce((total, purchaseItem) => {
                                            return total + (purchaseItem.total || 0)
                                        }, 0))}
                                    </Text>
                                </View>
                                <View style={styles.counter}>
                                    <Text render={({ pageNumber, totalPages }) => (
                                        `${pageNumber} / ${totalPages}`
                                    )} fixed />
                                </View>
                            </Page>
                        </Document>
                    </PDFViewer>
            }
        </>
    );
}