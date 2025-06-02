import { Routes } from '@angular/router';
import { InvoiceListComponent } from '../app/components/invoice-list/invoice-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/invoices', pathMatch: 'full' },
  { path: 'invoices', component: InvoiceListComponent },
  { path: '**', redirectTo: '/invoices' }
];
