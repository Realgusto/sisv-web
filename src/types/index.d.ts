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
    expenses: number;
    shopping: number;
    receipt: number;
    payment: number;
    updated_at: DateTime | null;
}

interface bestSeller {
    nome: string;
    quantidade: number;
    unidade: string;
    fill: string;
}