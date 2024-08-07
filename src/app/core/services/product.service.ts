/**
 * Service for managing products.
 * @module ProductService
 */

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
  /**
   * Creates an instance of ProductService.
   * @constructor
   * @param {HttpClient} http - The HTTP client for making requests.
   */
  constructor(private http: HttpClient) {
    fetch(this.url + "products", {
      method: "GET"
    })
      .then(response => {})
      .catch(error => {});
  }

  /** The base URL for API requests */
  url = environment.apiUrl;

  /**
   * Fetches all products from the server.
   * @returns {Promise<Observable<Product[]>>} A Promise that resolves to an Observable emitting an array of products.
   */
  getAllProducts = async (): Promise<Observable<Product[]>> => {
    return this.http.get<Product[]>(this.url + "products");
  };

  /**
   * Retrieves a product by its ID from the server.
   * @param {ObjectId} productId - The ID of the product to retrieve.
   * @returns {Observable<Product>} An Observable that emits the retrieved product.
   */
  getProductById(Productid: ObjectId): Observable<Product> {
    const apiurl = `${this.url}products/${Productid}`;
    return this.http.get<Product>(apiurl);
  }

  /**
   * Creates a new product on the server.
   * @param {Product} product - The product to create.
   * @returns {Observable<Product>} An Observable that emits the created product.
   */
  createProduct(Product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.url}products`, Product, httpOptions);
  }

  /**
   * Updates an existing product on the server.
   * @param {Product} Product - The updated product data.
   * @returns {Observable<Product>} An Observable that emits the updated product.
   */
  updateProduct(Product: Product): Observable<Product> {
    const apiurl = `${this.url}products/${Product._id}`;
    console.log(`Updating product at ${apiurl}`, Product);
    return this.http.put<Product>(apiurl, Product, httpOptions);
  }

  /**
   * Deletes a product by its ID from the server.
   * @param {string} productId - The ID of the product to delete.
   * @returns {Observable<number>} An Observable that emits the status code of the delete operation.
   */
  deleteProductById(Productid: string): Observable<number> {
    const apiurl = `${this.url}products/${Productid}`;
    return this.http.delete<number>(apiurl, httpOptions);
  }
}
