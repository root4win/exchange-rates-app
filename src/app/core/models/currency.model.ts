export interface CurrencyResponse {
  supportedCurrenciesMap:{
    [currencyCode: string]: Currency;
  }
}

interface Currency {
  currencyCode: string;
  currencyName: string;
  countryCode: string;
  countryName: string;
  status: string;
  availableFrom: string;
  availableUntil: string;
  icon: string;
}
