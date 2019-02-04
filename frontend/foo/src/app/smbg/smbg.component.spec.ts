import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmbgComponent } from './smbg.component';

describe('SmbgComponent', () => {
  let component: SmbgComponent;
  let fixture: ComponentFixture<SmbgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmbgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmbgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
