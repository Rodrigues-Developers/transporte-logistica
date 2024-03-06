import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId;
  description: string;
  amount: number;
  price: number;
  total_price: number;
  group: string;
  brand: string;
  factory_code: number;
  sub_group: string;
  sys_code: number;
}

export interface GroupedProducts {
  [prodCode: number]: Product[];
}
