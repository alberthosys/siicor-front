import { TestBed } from '@angular/core/testing';

import { SendComandsService } from './send-comands.service';

describe('SendComandsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendComandsService = TestBed.get(SendComandsService);
    expect(service).toBeTruthy();
  });
});
