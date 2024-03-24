import { ObjectId } from "mongodb";

export interface Company{
    _id?: ObjectId;
    name: String;
    uf: String;
    cnpj: String;
    type: String;
}