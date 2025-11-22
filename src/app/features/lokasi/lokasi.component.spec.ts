import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LokasiComponent } from './lokasi.component';

describe('LokasiComponent', () => {
  let component: LokasiComponent;
  let fixture: ComponentFixture<LokasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LokasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LokasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
