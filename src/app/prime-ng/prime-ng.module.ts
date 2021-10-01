import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TieredMenuModule } from "primeng/tieredmenu";
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import {TreeTableModule} from 'primeng/treetable';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TieredMenuModule
  ],
  exports: [
    TieredMenuModule,
    ButtonModule,
    MenuModule,
    MenubarModule,
    DropdownModule,
    TreeTableModule,
  ]
})
export class PrimeNgModule { }
