import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guestbook',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ✅
  templateUrl: './guestbook.component.html',
  styleUrl: './guestbook.component.scss'
})
export class GuestbookComponent {

}
