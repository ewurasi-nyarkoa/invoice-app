import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-invoice-form.component.html',
  styleUrls: ['./new-invoice-form.component.scss']
})
export class NewInvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      status: ['draft'], // Default status
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      items: this.fb.array([]),
      paymentTerms: [1, Validators.required],
      description: ['', Validators.required],
      createdAt: ['', Validators.required], // Will be set automatically later or handled by a date picker
      paymentDue: ['', Validators.required], // Will be calculated based on createdAt and paymentTerms
      total: [{ value: 0, disabled: true }], // Total will be calculated
    });

    // Add a default item row
    this.addItem();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  get itemFormGroups(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  newItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(i: number): void {
    this.items.removeAt(i);
  }

  // TODO: Implement total calculation for items and grand total
  // TODO: Implement date calculation for paymentDue

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const newInvoice: Invoice = this.invoiceForm.value;
      // Generate a simple random ID (replace with a better method in production)
      newInvoice.id = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Set creation date (basic implementation, use a date picker in a real app)
      if (!newInvoice.createdAt) {
         newInvoice.createdAt = new Date().toISOString().split('T')[0];
      }

      // Calculate payment due date (basic implementation)
      const createdAtDate = new Date(newInvoice.createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + newInvoice.paymentTerms);
      newInvoice.paymentDue = createdAtDate.toISOString().split('T')[0];


      // Recalculate totals to ensure correctness before submitting
      newInvoice.items.forEach(item => {
        item.total = item.quantity * item.price;
      });
      newInvoice.total = newInvoice.items.reduce((sum, item) => sum + item.total, 0);


      this.invoiceService.addInvoice(newInvoice);
      console.log('Form Submitted', newInvoice);
      this.router.navigate(['/invoices']); // Navigate back to the list after submission
    } else {
      console.log('Form is invalid');
      // TODO: Display validation errors to the user
    }
  }

  // Helper to calculate item total
  calculateItemTotal(itemFormGroup: FormGroup): void {
    const quantity = itemFormGroup.get('quantity')?.value || 0;
    const price = itemFormGroup.get('price')?.value || 0;
    itemFormGroup.get('total')?.setValue(quantity * price, { emitEvent: false });
    this.calculateGrandTotal();
  }

  // Helper to calculate grand total
  calculateGrandTotal(): void {
    const itemsTotal = this.items.controls.reduce((sum, itemControl) => {
      const itemTotal = itemControl.get('total')?.value || 0;
      return sum + itemTotal;
    }, 0);
    this.invoiceForm.get('total')?.setValue(itemsTotal, { emitEvent: false });
  }

  // Add listeners to item price and quantity changes
  onQuantityChange(itemFormGroup: FormGroup): void {
    this.calculateItemTotal(itemFormGroup);
  }

  onPriceChange(itemFormGroup: FormGroup): void {
    this.calculateItemTotal(itemFormGroup);
  }

  // Add listeners to createdAt and paymentTerms changes
  onDateOrTermsChange(): void {
    const createdAt = this.invoiceForm.get('createdAt')?.value;
    const paymentTerms = this.invoiceForm.get('paymentTerms')?.value;

    if (createdAt && paymentTerms) {
      const createdAtDate = new Date(createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + paymentTerms);
      this.invoiceForm.get('paymentDue')?.setValue(createdAtDate.toISOString().split('T')[0], { emitEvent: false });
    }
  }

}
