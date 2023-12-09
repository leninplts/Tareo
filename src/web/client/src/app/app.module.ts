import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TareoFormComponent } from './features/components/modal/tareo-form/tareo-form.component';

// configure language
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from './ngZorroAntdModule';
import { TareoComponent } from './features/components/modal/tareo/tareo.component';
import { HttpClientModule } from '@angular/common/http';
import { PdfComponent } from './pages/pdf/pdf.component';
registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TareoFormComponent,
    TareoComponent,
    PdfComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgZorroAntdModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
