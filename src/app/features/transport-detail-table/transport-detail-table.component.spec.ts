import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportDetailTableComponent } from './transport-detail-table.component';

describe('TransportDetailTableComponent', () => {
  let component: TransportDetailTableComponent;
  let fixture: ComponentFixture<TransportDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportDetailTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
