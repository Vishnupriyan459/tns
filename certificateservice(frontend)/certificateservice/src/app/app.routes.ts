import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
 // Import the new page component

@NgModule({
  declarations: [
    AppComponent,
      // Declare the NewPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule   // Add routing module here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
