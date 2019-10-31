import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [    
 { path: '', loadChildren: 'app/sn-components/home/home.module#HomeModule'},
 { path: 'home', loadChildren: 'app/sn-components/home/home.module#HomeModule'},
 { path: '**', redirectTo: 'app/sn-components/home/home.module#HomeModule' }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  declarations: [],  
})
export class AppRoutingModule { }
