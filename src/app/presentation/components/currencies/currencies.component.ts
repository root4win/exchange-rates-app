import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrenciesService } from '../../../core/services/currencies.service';
import { catchError, throwError } from 'rxjs';
import { CurrencyResponse } from '../../../core/models/currency.model';
import {KENDO_DROPDOWNLIST} from '@progress/kendo-angular-dropdowns'
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-currencies-dropdown',
  imports: [ KENDO_DROPDOWNLIST, FormsModule ],
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesComponent implements OnInit {
  currenciesList:  CurrencyResponse | null = null;
  currencyData: Array<{text: string, value: string}> = [];

  fromCurrency: {text: string, value: string} | null = null;
  toCurrency: {text: string, value: string} | null = null;
  currencyAmount: number  = 0;

  constructor(
    private currenciesService: CurrenciesService
  ){}

  ngOnInit(): void {
    this.loadAllCurrencies();
    this.loadCurrencyRates();

  }


  loadAllCurrencies(): void {
    this.currenciesService.fetchSupportedCurrencies().pipe(
      catchError(err => {
        console.error(`error while loading all currencies: <${err}>`);
        throw err;
      })
    ).subscribe({
      next: data => {
        console.log(data);
        this.currenciesList = data;

        if(data?.supportedCurrenciesMap){
          const emptyOption = {text: '', value: ''}
          this.currencyData = [emptyOption,...Object.keys(data.supportedCurrenciesMap).map(key => {

            const currency  = data.supportedCurrenciesMap[key];

            return {
              text: `${currency.currencyCode} - ${currency.currencyName || ''}`,
              value: currency.currencyCode || '',
            }
          })]
        }
      }
    })
  }

  loadCurrencyRates(){
    this.currenciesService.fetchRates().pipe(
      catchError(err => {
        console.error(`error while loading the rates <${err}>`);
        throw err;
      })
    ).subscribe({
      next: data => {
        console.log(data);
      }
    })
  }

  onConvertion(){
    if (this.fromCurrency && this.toCurrency) {
      const result = this.currenciesService.convertCurrencies( this.currencyAmount, this.fromCurrency.value, this.toCurrency.value);
      console.log('resultado:', result);
      window.alert(`The result is: ${result}`);
    }

    this.currencyAmount = 0;
    this.fromCurrency = null;
    this.toCurrency = null;

  }

  onFromChange( newValue: string) {
    console.log(newValue);
  }

  onToChange( newValue: string ) {
    console.log(newValue);
  }

  swapCurrencies(){
    let temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
  }
}
