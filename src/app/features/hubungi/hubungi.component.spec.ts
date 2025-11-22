import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubungiComponent } from './hubungi.component';

describe('HubungiComponent', () => {
  let component: HubungiComponent;
  let fixture: ComponentFixture<HubungiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HubungiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HubungiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
