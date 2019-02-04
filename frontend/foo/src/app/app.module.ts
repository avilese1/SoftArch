import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SmbgComponent } from './smbg/smbg.component';
import { DietComponent } from './diet/diet.component';
import { ActivityComponent } from './activity/activity.component';
import { SymptomComponent } from './symptom/symptom.component';

@NgModule({
  declarations: [
    AppComponent,
    SmbgComponent,
    DietComponent,
    ActivityComponent,
    SymptomComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
