import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "src/app/core/interfaces/product.interface";
import { ObjectId } from "mongodb";
import { environment } from "../../../environments/environment";

var httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class ProductService {
  constructor(private http: HttpClient) {
    fetch(this.url + "products", {
      method: "GET"
    })
      .then(response => {})
      .catch(error => {});
  }

  url = environment.apiUrl;

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url + "products");
  }

  getProductById(Productid: ObjectId): Observable<Product> {
    const apiurl = `${this.url}products/${Productid}`;
    return this.http.get<Product>(apiurl);
  }

  createProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.url}products`, Product, httpOptions);
  }

  updateProduct(Productid: string, Product: Product): Observable<Product> {
    const apiurl = `${this.url}/${Productid}`;
    return this.http.put<Product>(apiurl, Product, httpOptions);
  }

  deleteProductById(Productid: string): Observable<number> {
    const apiurl = `${this.url}/${Productid}`;
    return this.http.delete<number>(apiurl, httpOptions);
  }
}
