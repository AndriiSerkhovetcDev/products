import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'products'
  },

  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
  },

  {
    path: 'add',
    loadComponent: () => import('./components/add-product/add-product.component').then(m => m.AddProductComponent)
  },

  {
    path: 'edit/:id',
    loadComponent: () => import('./components/product-update/product-update.component').then(m => m.ProductUpdateComponent)
  },
];
