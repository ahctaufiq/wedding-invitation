import {
  Component,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var YT: any;  // ✅ penting untuk YouTube API

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit, AfterViewInit, OnDestroy {

  // ✅ Popup
  showLocation = false;
  showContact = false;
  showRSVP = false;
  isDoorOpening = false;

  // ✅ YouTube player
  player: any;

  // ✅ RSVP data
  rsvpName: string = '';
  rsvpCount: number = 1;
  rsvpPresence: string = '';

  // ✅ Pintu / Gate (mula-mula ON)
  showGate = true;

  // ✅ Music status (YouTube)
  isMusicPlaying = false;

  // === Target date (Tarikh) ===
  // Using Malaysia calendar / timezone (Asia/Kuala_Lumpur)
  readonly targetDateParts = { year: 2026, month: 8, day: 22 };
  targetDisplay: string = '';
  targetMalayLong: string = '';
  daysUntil: number = 0; // positive => days remaining; 0 => today; negative => past

  // target for automatic scroll on first load
  @ViewChild('inviteSection') inviteSection!: ElementRef<HTMLElement>;

  // Auto-read (animated) scrolling state
  autoScrollActive = false;
  autoScrollSpeed = 40; // px per second
  private _autoScrollRaf: number | null = null;
  private _lastRafTimestamp = 0;

  ngOnInit(): void {
    // 🔥 Load YouTube Iframe API sekali sahaja
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    // Bila API dah ready, create player
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('yt-player', {
        height: '0',
        width: '0',
        videoId: '8bWRU2ipOwA',    // 👈 ID dari link Taufiq
        playerVars: {
          autoplay: 0,             // kita akan play bila user click
          controls: 0,
          loop: 1,
          playlist: '8bWRU2ipOwA'  // wajib untuk loop
        },
        events: {
          onReady: (event: any) => {
            // jangan play di sini – tunggu user tekan "Masuk"
          }
        }
      });
    };

    // ❌ Kalau tak nak page auto-scroll masa depan, buang bahagian ini
    // setTimeout(() => {
    //   if (typeof window === 'undefined') return;
    //   window.scrollTo({ top: 180, behavior: 'smooth' });
    // }, 800);

    // Compute and format target date and countdown using Malaysia calendar/timezone
    this.updateTargetDateInfo();
  }

  /**
   * Return the year/month/day for a Date in the given IANA timezone.
   * Uses Intl.DateTimeFormat.formatToParts to extract components.
   */
  private getDatePartsInTimeZone(date: Date, timeZone: string) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = fmt.formatToParts(date);
    const year = Number(parts.find(p => p.type === 'year')?.value || 0);
    const month = Number(parts.find(p => p.type === 'month')?.value || 0);
    const day = Number(parts.find(p => p.type === 'day')?.value || 0);
    return { year, month, day };
  }

  private updateTargetDateInfo() {
    const tz = 'Asia/Kuala_Lumpur';

    // Target date components (as declared)
    const t = this.targetDateParts;

    // Format simple dd/mm/yyyy for display
    const dd = String(t.day).padStart(2, '0');
    const mm = String(t.month).padStart(2, '0');
    const yyyy = String(t.year);
    this.targetDisplay = `${dd}/${mm}/${yyyy}`;

    // Long Malay format (weekday, day month year) in Malaysia timezone
    try {
      const targetForFormat = new Date(Date.UTC(t.year, t.month - 1, t.day));
      this.targetMalayLong = new Intl.DateTimeFormat('ms-MY', {
        timeZone: tz,
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }).format(targetForFormat);
    } catch (e) {
      this.targetMalayLong = `${dd}/${mm}/${yyyy}`;
    }

    // Calculate days-between using Malaysia calendar date (midnight in KL)
    const now = new Date();
    const nowParts = this.getDatePartsInTimeZone(now, tz);
    const nowUtcMidnight = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day);
    const targetUtcMidnight = Date.UTC(t.year, t.month - 1, t.day);
    const msPerDay = 24 * 60 * 60 * 1000;
    this.daysUntil = Math.floor((targetUtcMidnight - nowUtcMidnight) / msPerDay);
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    // ❌ kosongkan – kita hanya scroll lepas user tekan "Masuk"
  }

  // 🎵 Dipanggil bila user tekan butang pada pintu
  onGateClick(): void {
    // Start animasi pintu
    this.isDoorOpening = true;

    // Tunggu animasi siap (ikut duration CSS, contoh 900ms)
    setTimeout(() => {
      this.showGate = false;   // gate hilang

      // Scroll ke jemputan lepas pintu buka
      if (typeof window !== 'undefined') {
        try {
          if (this.inviteSection && this.inviteSection.nativeElement) {
            this.inviteSection.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (e) {}
      }

      // (Optional) auto-scroll kalau nak
      // this.startAutoScroll();

      // 🎵 Mainkan YouTube bila user dah click
      try {
        if (this.player) {
          this.player.playVideo();
          this.isMusicPlaying = true;
        }
      } catch (e) {
        console.log('Player belum ready:', e);
      }

    }, 900); // 👈 sama/lebih sikit dari waktu animasi CSS
  }


  toggleMusic(): void {
    if (!this.player) return;

    if (this.isMusicPlaying) {
      this.player.pauseVideo();
      this.isMusicPlaying = false;
    } else {
      this.player.playVideo();
      this.isMusicPlaying = true;
    }
  }

  // === Auto-scroll control ===
  toggleAutoScroll(): void {
    if (this.autoScrollActive) {
      this.stopAutoScroll();
    } else {
      this.startAutoScroll();
    }
  }

  startAutoScroll(): void {
    if (typeof window === 'undefined') return;
    if (this.autoScrollActive) return;
    this.autoScrollActive = true;
    this._lastRafTimestamp = 0;
    this._autoScrollRaf = requestAnimationFrame(
      this._autoScrollStep.bind(this)
    );
  }

  stopAutoScroll(): void {
    this.autoScrollActive = false;
    if (this._autoScrollRaf !== null) {
      cancelAnimationFrame(this._autoScrollRaf);
      this._autoScrollRaf = null;
    }
    this._lastRafTimestamp = 0;
  }

  private _autoScrollStep(timestamp: number): void {
    if (!this.autoScrollActive) return;
    if (!this._lastRafTimestamp) this._lastRafTimestamp = timestamp;
    const deltaMs = timestamp - this._lastRafTimestamp;
    this._lastRafTimestamp = timestamp;

    const pixels = (this.autoScrollSpeed * deltaMs) / 1000;
    try {
      window.scrollBy({ top: pixels, left: 0, behavior: 'auto' });
    } catch (e) {
      // ignore
    }

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;

    if (atBottom) {
      this.stopAutoScroll();
      return;
    }

    this._autoScrollRaf = requestAnimationFrame(
      this._autoScrollStep.bind(this)
    );
  }

  // === POPUP Lokasi / Contact / RSVP ===
  openLocation() {
    // toggle location popup; ensure only one popup is open at a time
    this.showLocation = !this.showLocation;
    if (this.showLocation) {
      this.showContact = false;
      this.showRSVP = false;
    }
  }

  closeLocation() {
    this.showLocation = false;
  }

  openContact() {
    // toggle contact popup; ensure only one popup is open at a time
    this.showContact = !this.showContact;
    if (this.showContact) {
      this.showLocation = false;
      this.showRSVP = false;
    }
  }

  closeContact() {
    this.showContact = false;
  }

  openRSVP() {
    // toggle rsvp popup; ensure only one popup is open at a time
    this.showRSVP = !this.showRSVP;
    if (this.showRSVP) {
      this.showLocation = false;
      this.showContact = false;
    }
  }

  closeRSVP() {
    this.showRSVP = false;
  }

  setPresence(value: string) {
    this.rsvpPresence = value;
  }

  sendRSVP() {
    const name = this.rsvpName || 'Tetamu';
    const count = this.rsvpCount || 1;
    const presence = this.rsvpPresence || 'Tidak pasti';

    const message =
      `RSVP Majlis Kahwin\n` +
      `Nama: ${name}\n` +
      `Bilangan Tetamu: ${count}\n` +
      `Kehadiran: ${presence}`;

    const url = `https://wa.me/601131252114?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  }

  // === HostListener untuk stop auto-scroll bila user gerak sendiri ===
  @HostListener('window:wheel')
  onUserWheel(): void {
    if (this.autoScrollActive) this.stopAutoScroll();
  }

  @HostListener('window:touchstart')
  onUserTouch(): void {
    if (this.autoScrollActive) this.stopAutoScroll();
  }

  @HostListener('window:click')
  onUserClick(): void {
    if (this.autoScrollActive) this.stopAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();

    // 🎵 Pastikan YouTube player stop
    try {
      if (this.player && this.player.stopVideo) {
        this.player.stopVideo();
      }
    } catch (e) {}

    this.isMusicPlaying = false;
  }
}
