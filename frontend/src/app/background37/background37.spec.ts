import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Background37 } from './background37';

describe('Background37', () => {
  let component: Background37;
  let fixture: ComponentFixture<Background37>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Background37]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Background37);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
