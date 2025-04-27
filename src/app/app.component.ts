import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CurrenciesDropdownComponent } from "./presentation/components/currencies-dropdown/currencies-dropdown.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CurrenciesDropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'currency-exchange-api';
}
