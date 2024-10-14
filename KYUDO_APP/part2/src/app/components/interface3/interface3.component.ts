import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-interface3',
  templateUrl: './interface3.component.html',
  styleUrls: ['./interface3.component.scss'],
})
export class Interface3Component implements OnInit {

  constructor(private barcodeScanner: BarcodeScanner) { }

  ngOnInit() {
    console.log('rrrr');

  }
  async scanQRCode() {
    try {
      const result = await this.barcodeScanner.scan();
      console.log('Scanned QR code data:', result.text);
      // Handle the scanned QR code data as needed
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
  }
}
