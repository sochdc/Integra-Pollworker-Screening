import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePollworker } from './create-pollworker';

describe('CreatePollworker', () => {
  let component: CreatePollworker;
  let fixture: ComponentFixture<CreatePollworker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePollworker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePollworker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
