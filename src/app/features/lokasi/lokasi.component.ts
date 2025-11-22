import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lokasi',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ✅
  templateUrl: './lokasi.component.html',
  styleUrls: ['./lokasi.component.scss'],
})
export class LokasiComponent {}
