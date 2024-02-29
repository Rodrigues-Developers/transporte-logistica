import { Double, ObjectId } from "mongodb";

export interface Logistic {
  _id?: ObjectId;
  nfe: String;
  operation: String;
  emission_date: Date;
  supplier: ObjectId;
  receiver: ObjectId;
  transporter: ObjectId;
  freight: number;
  discount: number;
  total_product_value: number;
  total_note_value: number;
  arrival_forecast: Date;
  date_out: Date;
  bulk: number;
  shipping_on_account: boolean;
  merchandise: [ObjectId];
  note: String;
  pin_release: Date;
  status: String;
}

export interface UserNote {
  readonly _id?: ObjectId;
  date: Date;
  note: string;
}
