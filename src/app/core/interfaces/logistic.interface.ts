import { ObjectId } from "mongodb";

export interface Logistic {
  _id?: ObjectId;
  nfe: string;
  emissionNf: Date;
  shipping_company: string;
  arrival_forecast: string;
  date_out: Date;
  merchandise: [string];
  nfe_value: number;
  note: UserNote[];
  pin_release: string;
  status: string;
}

export interface UserNote {
  readonly _id?: ObjectId;
  date: Date;
  note: string;
}
