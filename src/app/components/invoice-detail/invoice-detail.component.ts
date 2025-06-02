import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { CommonModule } from '@angular/common';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, DeleteConfirmationModalComponent, RouterLink],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.scss'
})
export class InvoiceDetailComponent implements OnInit {
  invoice$!: Observable<Invoice | undefined>;
  isDeleteModalOpen: boolean = false;
  currentInvoiceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.invoice$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.currentInvoiceId = id;
        return this.invoiceService.getInvoiceById(id || '');
      })
    );
  }

  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  confirmDelete(): void {
    if (this.currentInvoiceId) {
      this.invoiceService.deleteInvoice(this.currentInvoiceId).subscribe(() => {
        this.router.navigate(['/']); 
        this.closeDeleteModal();
      });
    }
  }
}
