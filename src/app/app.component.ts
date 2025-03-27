import { Component } from '@angular/core';
import { ExchangeWidgetComponent } from './components/exchange-widget/exchange-widget.component';

@Component({
    selector: 'app-root',
    imports: [ExchangeWidgetComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
