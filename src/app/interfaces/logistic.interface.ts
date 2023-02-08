export interface Logistic {
    id?:string;
    nfe: string;
    emissionNf: Date;
    shipping_company: string;
    arrival_forecast: string;
    date_out: Date;
    merchandise: Object;
    nfe_value: number;
    note: string;
    pin_release: string;
    status: string;
}