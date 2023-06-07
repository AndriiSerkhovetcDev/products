import { Routes } from '@angular/router';
import { AuthGuard } from "./guard/auth.guard";

export const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: 'products'
  },

  { path: 'login',
    loadComponent: () => import('./components/auth-form/auth-form.component').then(m => m.AuthFormComponent),
  },

  { path: 'register',
    loadComponent: () => import('./components/auth-form/auth-form.component').then(m => m.AuthFormComponent),
  },

  {
    path: 'products',
    loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent),
    // canActivate: [AuthGuard],
  },

  {
    path: 'add',
    loadComponent: () => import('./components/add-product/add-product.component').then(m => m.AddProductComponent),
    // canActivate: [AuthGuard],
  },

  {
    path: 'edit/:id',
    loadComponent: () => import('./components/product-update/product-update.component').then(m => m.ProductUpdateComponent),
    // canActivate: [AuthGuard],
  },
];
