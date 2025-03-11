import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService, CryptoData } from '../../services/crypto.service';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.css'],
})
export class CryptoComponent implements OnInit {
  cryptoPrices: CryptoData[] = [];

  constructor(private cryptoService: CryptoService) {}

  ngOnInit() {
    this.cryptoService.getCryptoUpdates().subscribe((data: CryptoData) => {
      const existingCoin = this.cryptoPrices.find(
        (coin) => coin.symbol === data.symbol
      );
      if (existingCoin) {
        existingCoin.price = data.price;
      } else {
        this.cryptoPrices.push(data);
      }
    });
  }
}
