import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 
    'product', 
    'category', 
    'date',
    'condition',
    'price',
    'description',
    'actions',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {}
  title = 'my-app';

  ngOnInit() {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
    })
      .afterClosed()
      .subscribe(result => {
        if (result === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.api.getProduct()
      .subscribe({
        next: (data) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert(`Error`);
          console.log(err);
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(product: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: product
    })
      .afterClosed()
      .subscribe(result => {
        if (result === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(product: any) {
    this.api.deleteProduct(product)
      .subscribe({
        next: () => {
          alert(`Product was deleted successfully`);
          this.getAllProducts();
        }
      })
  }
}

