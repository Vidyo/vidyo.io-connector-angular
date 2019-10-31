import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Routing} from './home.route';
import {HomeComponent} from './home.component';


import {FormsModule} from "@angular/forms";
import {MatDialogModule, MatFormFieldModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    Routing,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  declarations: [HomeComponent],
  entryComponents: [HomeComponent]
})

export class HomeModule {
}
