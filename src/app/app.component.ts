import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrenciesComponent } from "./presentation/components/currencies/currencies.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CurrenciesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-exchange-api';
}
