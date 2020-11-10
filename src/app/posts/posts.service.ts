import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Product } from './product.model';
const BackEnd_Url = environment.apiUrl + '/posts/';
@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [];
  private productsupdated = new Subject<{ products: Product[]; productCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: any; maxproducts: number }>(
        BackEnd_Url + queryParams
      )
      .pipe(
        map(productdata => {
          return {
            products: productdata.products.map(product => {
              return {
                title: product.title,
                comment: product.comment,
                id: product._id,
                imagePath: product.imagePath,
                              };
            }),
            maxproducts: productdata.maxproducts
          };
        })
      )
      .subscribe(transformedProductData => {
        this.products = transformedProductData.products;
        this.productsupdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxproducts
        });
      });
  }

  getProductUpdateListener() {
    return this.productsupdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      comment: string;
      imagePath: string;

    }>(BackEnd_Url + id);
  }

  addProduct(title: string, comment: string, image: File) {
    const productData = new FormData();
    productData.append('title', title);
    productData.append('comment', comment);
    productData.append('image', image, title);
    this.http
      .post<{ message: string; product: Product }>(
        BackEnd_Url,
        productData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateProduct(id: string, title: string, comment: string, image: File | string) {
    let productData: Product | FormData;
    if (typeof image === 'object') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('title', title);
      productData.append('comment', comment);
      productData.append('image', image, title);
    } else {
      productData = {
        id: id,
        title: title,
        comment: comment,
        imagePath: image,
      };
    }
    this.http
      .put(BackEnd_Url + id, productData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteProduct(productId: string) {
    return this.http.delete(BackEnd_Url + productId);
  }
}
