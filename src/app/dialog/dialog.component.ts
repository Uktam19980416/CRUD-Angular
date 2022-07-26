import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  products: string[] = ['New', 'Second Hand', 'B/Y'];
  productForm!: FormGroup;
  addBtn: string = 'Save';

  constructor(
    private productBuilder: FormBuilder, 
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
    ) {}

  ngOnInit(): void {
    this.productForm = this.productBuilder.group({
      product: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      condition: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });

    if (this.editData) {
      this.addBtn = "Update";
      this.productForm.patchValue(this.editData);
      // this.productForm.controls['product'].setValue(this.editData.product);
      // this.productForm.controls['category'].setValue(this.editData.category);
      // this.productForm.controls['date'].setValue(this.editData.date);
      // this.productForm.controls['condition'].setValue(this.editData.condition);
      // this.productForm.controls['price'].setValue(this.editData.price);
      // this.productForm.controls['description'].setValue(this.editData.description);
    }
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
      this.api.postProduct(this.productForm.value)
        .subscribe({
          next: (data) => {
            alert("Product was added successfully");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error: (err) => { alert("Product was added successfully"); },
        })
      }
    } else {
        this.updateProduct();
      }
  };

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: () => {
          alert("Product was updated successfully");
          this.productForm.reset();
          this.dialogRef.close('update');
        }, 
        error: (err: any) => {
          alert("Wrong data");
        }
      })
  }

}

