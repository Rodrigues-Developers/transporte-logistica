import { TestBed } from '@angular/core/testing';

import { PopupStateService } from './popup-state.service';

describe('PopupStateService', () => {
  let service: PopupStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
