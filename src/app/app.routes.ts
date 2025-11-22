import { Routes } from '@angular/router';
import { InvitationComponent } from './features/invitation/invitation.component';
import { LokasiComponent } from './features/lokasi/lokasi.component';
import { GuestbookComponent } from './features/guestbook/guestbook.component';
import { RsvpComponent } from './features/rsvp/rsvp.component';

export const routes: Routes = [
  { path: '', component: InvitationComponent },         // page utama
  { path: 'lokasi', component: LokasiComponent },       // 1: Lokasi
  { path: 'guestbook', component: GuestbookComponent }, // 2: Ucapan tetamu
  { path: 'rsvp', component: RsvpComponent },           // 3: RSVP
];
