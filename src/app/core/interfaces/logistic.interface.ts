import { ObjectId } from "mongodb";
import { Company } from "src/app/core/interfaces/company.interface";

export interface Logistic {
  _id?: ObjectId;
  nfe: String;
  key: String;
  operation: String;
  emission_date: Date;
  supplier: Company;
  receiver: Company;
  transporter: Company;
  freight: Number;
  discount: Number;
  total_product_value: Number;
  total_note_value: Number;
  arrival_forecast?: Date;
  date_out?: Date;
  bulk: Number;
  shipping_on_account: boolean;
  merchandise: ObjectId[];
  note?: UserNote[];
  pin_release?: Date;
  status: String;
}

export interface UserNote {
  _id?: ObjectId;
  date: Date;
  note: string;
}
