import { Routes } from '@angular/router';
import { InvoiceListComponent } from '../app/components/invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { EditInvoiceFormComponent } from './components/edit-invoice-form/edit-invoice-form.component';
import { NewInvoiceFormComponent } from './components/new-invoice-form/new-invoice-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/invoices', pathMatch: 'full' },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: NewInvoiceFormComponent },
  { path: 'invoices/:id', component: InvoiceDetailComponent },
  { path: 'invoices/:id/edit', component: EditInvoiceFormComponent },
  { path: '**', redirectTo: '/invoices' }
];
