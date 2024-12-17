interface MonthlySales {
    mes: string;
    valor: number;
}

interface MetricsType {
    salesMonthly: number;
    averageTicket: number;
    salesLastYear: {
        mth: number;
        tot_sales: number;
    }[];
    top5BestSeller: {
        product: string;
        amount: number;
        un: string;
    }[];
    activeCustomers: number;
    inactiveCustomers: number;
}

interface bestSeller {
    nome: string;
    quantidade: number;
    unidade: string;
    fill: string;
}