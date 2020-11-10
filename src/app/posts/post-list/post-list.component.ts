import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Product } from "../product.model";
import { ProductService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
   products: Product[]=[];

  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.productService.getProducts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.productService
      .getProductUpdateListener()
      .subscribe((productdata: { products: Product[]; productCount: number }) => {
        this.isLoading = false;
        this.totalPosts = productdata.productCount;
        this.products = productdata.products;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.productService.getProducts(this.postsPerPage, this.currentPage);
  }

  onDelete(productId: string) {
    this.isLoading = true;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.productService.getProducts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
