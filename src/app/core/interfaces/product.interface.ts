import { ObjectId } from "mongodb";

export interface Product {
  _id?: ObjectId;
  nfeRef: nfeReference[];
  description: string;
  price: number;
  total_price: number;
  group?: string;
  brand: string;
  factory_code: string;
  sub_group?: string;
  sys_code?: number;
}

export interface nfeReference {
  nfeId: ObjectId;
  amount: number;
}

export interface GroupedProducts {
  [prodCode: number]: Product[];
}
