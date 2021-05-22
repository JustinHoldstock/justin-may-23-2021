import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OrderTableComponent } from './components/order-table/order-table.component';
import { GroupControlComponent } from './components/group-control/group-control.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderTableComponent,
    GroupControlComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
