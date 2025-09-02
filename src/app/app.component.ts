// import { Component, OnInit } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { ThemeService } from './services/theme.service';
// import { CommonModule } from '@angular/common';
// import { InvoiceService } from './services/invoice.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, CommonModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent implements OnInit {
//   title = 'invoice-app';

//   constructor(public themeService: ThemeService, private invoiceService: InvoiceService) {}

//   ngOnInit(): void {
//     this.invoiceService.loadInvoices().subscribe();
//   }

//   toggleTheme(): void {
//     this.themeService.toggleTheme();
//   }

//   isDarkTheme(): boolean {
//     return this.themeService.isDarkTheme();
//   }
// }


import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';
import { InvoiceService } from './services/invoice.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'invoice-app';
  private readonly oidcSecurityService = inject(OidcSecurityService);
  isAuthenticated = false;

  constructor(public themeService: ThemeService, private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      this.isAuthenticated = isAuthenticated;
      console.log('Authentication status:', isAuthenticated);
      if (isAuthenticated) {
        console.log('User data:', userData);
        this.router.navigate(['/invoices/new']);
      } else {
        this.router.navigate(['/invoices']);
      }
    });

    this.invoiceService.loadInvoices().subscribe();
  }

  // Method to initiate the login process
  login(): void {
    this.oidcSecurityService.authorize();
  }

  // Method to log out the user
  logout(): void {
    this.oidcSecurityService.logoffLocal();
    this.isAuthenticated = false;
    this.router.navigate(['/invoices']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkTheme(): boolean {
    return this.themeService.isDarkTheme();
  }
}