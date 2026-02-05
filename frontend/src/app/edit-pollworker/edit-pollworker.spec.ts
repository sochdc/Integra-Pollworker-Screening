import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPollworker } from './edit-pollworker';

describe('EditPollworker', () => {
  let component: EditPollworker;
  let fixture: ComponentFixture<EditPollworker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPollworker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPollworker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
