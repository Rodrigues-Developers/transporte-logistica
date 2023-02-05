import { Product } from './product.type';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

var httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {
    fetch('http://localhost:3000/logistics', {
      method: 'GET',
    })
      .then((response) => {})
      .catch((error) => {});
  }

  url = 'http://localhost:3000/logistics';

  getAllProducts(): Observable<Product[]> {
    console.log('teste' + this.http.get<Product[]>(this.url));
    return this.http.get<Product[]>(this.url);
  }

  getProductById(Productid: string): Observable<Product> {
    const apiurl = `${this.url}/${Productid}`;
    return this.http.get<Product>(apiurl);
  }

  createProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, Product, httpOptions);
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
