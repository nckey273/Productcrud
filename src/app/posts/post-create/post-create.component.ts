import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductService } from '../posts.service';
import { Product } from '../product.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private productId: string;
  private authStatusSub: Subscription;

  constructor(
    public productService: ProductService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      comment: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {
            id: productData._id,
            title: productData.title,
            comment: productData.comment,
            imagePath: productData.imagePath,

          };
          this.form.setValue({
            title: this.product.title,
            comment: this.product.comment,
            image: this.product.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productService.addProduct(
        this.form.value.title,
        this.form.value.comment,
        this.form.value.image
      );
    } else {
      this.productService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.comment,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
