import { ObjectId } from "mongodb";

export interface Logistic {
    _id?:ObjectId;
    nfe: string;
    emissionNf: Date;
    shipping_company: string;
    arrival_forecast: string;
    date_out: Date;
    merchandise: [string];
    nfe_value: number;
    note: string;
    pin_release: string;
    status: string;
}