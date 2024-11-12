interface VendasMensais {
    mes: string;
    valor: number;
}

interface Order {
    id: UUID;
    date: Date;
    delivery_date: Date;
    status: string;
    supplier: string;
    product: string;
    quantity: number;
    value: number;
    observations?: string;
}
    
interface Budget {
    id: UUID;
    date: Date;
    delivery_date: Date;
    status: string;
    supplier: string;
    product: string;
    quantity: number;
    value: number;
    observations?: string;
}
