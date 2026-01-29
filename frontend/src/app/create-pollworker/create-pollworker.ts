import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, EventEmitter, inject, Injector, Input, input, Output, output, signal } from '@angular/core';
import { Background37 } from '../background37/background37';
import { MonthObject, monthsList, primaryLanguageList, primaryLanguageObject, screenName, secondaryLanguageList, secondaryLanguageObject, StateObject, statesList } from '../model';
import { CommonModule } from '@angular/common';
import {  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Helpservice } from '../helpservice';
import { ScreeningService } from '../screening-service';

interface FieldConfig {
  activeFlag: boolean;
  dataModelName: string;
  dataModelUniqueId: string;
  displayName: string;
  fieldName: string;
  fieldType: string;
  localityDataModelFieldId: number;
  localityId: number;
  requiredFlag: boolean;
}

@Component({
  selector: 'app-create-pollworker',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './create-pollworker.html',
  styleUrl: './create-pollworker.scss',
})
export class CreatePollworker {
 screenNames = input<Array<screenName>>([]);
  public createPollworkerForm: FormGroup | null = null;
    public readonly show = signal<boolean>(false);
  private fb = inject(FormBuilder);
  public states = signal<Array<StateObject>>([]);
   public months = signal<Array<MonthObject>>([]);
   public showContact = signal<true | false>(false);
   public secondaryLanguage= signal<Array<secondaryLanguageObject>>([]);
    public primaryLanguage = signal<Array<primaryLanguageObject>>([]);

   public days = signal<{ name: string; value: string }[]>([]);

   public fieldObject = input<screenName | null>(null);
   public displayName= input<string>('');
    @Output() eventInputData = new EventEmitter<any>();
    inputValue: boolean = false;

    @Input() questions: any[] = [];
  @Input() indexValue!: number;
selectedGender: string = '';
  @Output() eventInputData1 = new EventEmitter<any>();
  @Input() editValue: any = null;
 private screeningService = inject(ScreeningService);
 private helpService = inject(Helpservice);
  // SSN show/hide
  public showSsn = signal<boolean>(false);
   public modelValue = signal<any>(null);
  selectedOptionId: number | null = null;
agreementForm!: FormGroup;

    public genderOptions = signal<{ name: string; value: string }[]>([
  { name: 'Male', value: 'Male' },
  { name: 'Female', value: 'Female' },
  { name: 'Other', value: 'Other' },
]);



  pwQuestionData: any;

  constructor(private injector: Injector){
   this.states.set(statesList);
   this.months.set(monthsList);
   this.primaryLanguage.set(primaryLanguageList);
   this.secondaryLanguage.set(secondaryLanguageList);
   this.getPWLoadMethodData();
 effect(() => {
      const one = this.screenNames();
      if (one) {
     this.createPollworkerForm = this.fb.group({});
        // Populate the form array with initial data
        this.buildForm();
        const month = this.createPollworkerForm?.get('monthOfBirth')?.value;
  const year = this.createPollworkerForm?.get('yearOfBirth')?.value;

 if (!month || (month === 'feb' && !year)) {
    this.days.set([]);
    return;
  }

  this.updateDaysDropdown();
  
      }
      this.modelValue.set(this.editValue ?? null);
    });

  }

    get question() {
    return this.questions?.[this.indexValue];
  }
   ngOnInit(): void {
    const selected = this.question?.pwQuestionOptionDTOs?.find(
      (o: any) => o.selected === true
    );

    if (selected) {
      this.selectedOptionId = selected.pwQuestionOptionId;
    }
  this.agreementForm = this.fb.group({
    acceptTerms: [false, Validators.requiredTrue]
  });
  }
onSelect(opt: any) {
    // reset selections
    this.question.pwQuestionOptionDTOs.forEach((o: any) => {
      o.selected = false;
    });

    opt.selected = true;
    this.selectedOptionId = opt.pwQuestionOptionId;

    // keep backend object in sync
    this.question.pwQuestionOptionDTO = {
      pwQuestionOptionId: opt.pwQuestionOptionId,
      name: opt.name,
      selected: true,
    };

    // emit full questions list (same as before)
    this.eventInputData1.emit(this.questions);
  }

  selectByLabel(opt: any) {
    this.onSelect(opt);
  }

  buildForm(){
     this.screenNames().forEach(fieldData => {
      fieldData.requiredFlag=true;
            const conditionalValidators: ValidatorFn[] = [];
          if (fieldData.requiredFlag) {
                conditionalValidators.push(Validators.required);
                conditionalValidators.push(Validators.minLength(fieldData.minLength));
                conditionalValidators.push(Validators.maxLength(fieldData.maxLength));
console.log("Required Condition:",fieldData)
            }
                if (fieldData.fieldName === 'emailId') {

      conditionalValidators.push(
        Validators.email
      );
    }
             this.createPollworkerForm?.addControl(
        fieldData.fieldName,
        new FormControl(null, conditionalValidators)
      );
  });
}

getPWLoadMethodData() {
  console.log("inside pw load data method:")
    let applicationId = this.helpService.localityInfo().applicationId!;
        this.screeningService.getPWLoadData(applicationId,2)
            .subscribe({
                next: (pwQuestion: any) => {
                  console.log("inside pw question is:",pwQuestion)
                    if (pwQuestion && pwQuestion.length > 0)
                        this.pwQuestionData.set(pwQuestion);
                },
                error: (error) => {
                  // console.error(error);
                }
            });
    }
    
  getFiledObject(type: string): screenName {
    if (this.screenNames) {
      return this.screenNames().filter((x) => {
        return x?.fieldName == type;
      })[0];
      // requiredFlag
      //
    }
    return null!;
  }

  saveData(type: string, event: any) {
  const value= event?.detail ?? event;
    //this.createPollworkerForm?.get(type)?.setValue(event.detail);
    this.createPollworkerForm?.get(type)?.setValue(value);
this.createPollworkerForm?.get(type)?.markAsDirty();
this.createPollworkerForm?.get(type)?.updateValueAndValidity({ emitEvent: false});
    // console.log(this.createPollworkerForm?.value);
     //console.log(this.createPollworkerForm);
  

  }
getFieldValue(type: string):any{
let val = this.createPollworkerForm ? this.createPollworkerForm.get(type)?.value : null;
    if (val) return val;
    return null;
}
  isClose = output<any>();
     handleCancel(): void {
        this.isClose.emit(true);
    }
  updateDaysDropdown() {
  const month = this.createPollworkerForm?.get('monthOfBirth')?.value;
  const year = +this.createPollworkerForm?.get('yearOfBirth')?.value;

  if (!month || !year) {
    this.days.set([]);
    return;
  }

  let numDays = 31;

  if (['apr','jun','sep','nov'].includes(month)) numDays = 30;
  else if (month === 'feb') {
    numDays = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
  }

  const dayList = Array.from({ length: numDays }, (_, i) => ({
    name: (i + 1).toString(),
    value: (i + 1).toString()
  }));

  this.days.set(dayList);
}
sendValue(event:any) {
    // binary checkbox => event.checked is boolean
   // const checked= (event.target as HTMLInputElement).checked;
   const checked=!!event?.target?.checked;
    this.inputValue=checked;
   // this.eventInputData.emit(!!event.checked);
   this.eventInputData.emit({ detail: checked});

} 
  getName(type: string) {
    if (this.screenNames) {
      return this.screenNames().filter((x) => {
        return x?.fieldName == type;
      })[0].displayName;
      // requiredFlag
      //
    }
    return '';
  }
 /* getAddress(value: any) {
    if (value.detail) {
      this.createPollworkerForm!.get('')!.setValue(this.createPollworkerForm!?.get('')!.value);
      this.createPollworkerForm!.get('')!.setValue(this.createPollworkerForm!?.get('')!.value);
    }
  } */
 getAddress(event: any) {
  // soch-checkbox should emit boolean OR { detail: boolean }
  const checked = typeof event === 'boolean' ? event : !!event?.detail;

  if (!this.createPollworkerForm) return;

  const map: Array<[string, string]> = [
    ['address1', 'mailingAddress1'],
    ['address2', 'mailingAddress2'],
    ['city', 'mailingCity'],
    ['state', 'mailingState'],
    ['zipCode', 'mailingZipCode'],
  ];

  if (checked) {
    map.forEach(([from, to]) => {
      const val = this.createPollworkerForm?.get(from)?.value ?? null;
      this.createPollworkerForm?.get(to)?.setValue(val);
      this.createPollworkerForm?.get(to)?.markAsDirty();
      //this.createPollworkerForm?.get(to)?.updateValueAndValidity({ emitEvent: false });
    });
  } else {
    // if you want to clear when unchecked
    map.forEach(([_, to]) => {
     /* if(to === 'mailingState'){
        console.log('mailingState value:',this.createPollworkerForm?.get('mailingState')?.value);
      this.createPollworkerForm?.get(to)?.reset('');
      } else{*/
        this.createPollworkerForm?.get(to)?.reset();
   //   }
     // this.createPollworkerForm?.get(to)?.markAsPristine();
      //this.createPollworkerForm?.get(to)?.updateValueAndValidity({ emitEvent: false });
    });
  }
}
saveGender(event: any){
  console.log("event is :",event)

}
   clearCreate() {
    this.showContact.set(false);
  }
  isSsnField(): boolean {
    return this.fieldObject()?.fieldName === 'ssn';
  }
  toggleSsn(): void {
    this.showSsn.set(!this.showSsn());
  }
    getInputType(): string {
    if (this.isSsnField()) {
      return this.showSsn() ? 'text' : 'password';
    }
    // keep it simple: normal text field
    return 'text';
  }
   onValueChange(value: any): void {
    // keep your existing event structure
    this.eventInputData.emit({ detail: value });
  }
  isFormValid(): boolean {
  return !!(
    this.createPollworkerForm &&
    this.createPollworkerForm.valid &&
    this.agreementForm &&
    this.agreementForm.valid
  );
}

private hasValue(val: any): boolean {
  if (val === null || val === undefined) return false;

  if (typeof val === 'string') return val.trim().length > 0;

  if (typeof val === 'number') return true;

  if (typeof val === 'boolean') return val === true;

  if (typeof val === 'object') {
    // Handle dropdown objects like { code:'AL', name:'Alabama' } or { value:'AL', label:'Alabama' }
    const obj: any = val;

    if (obj.value !== null && obj.value !== undefined && `${obj.value}`.trim() !== '') return true;
    if (obj.code !== null && obj.code !== undefined && `${obj.code}`.trim() !== '') return true;
    if (obj.name !== null && obj.name !== undefined && `${obj.name}`.trim() !== '') return true;
    if (obj.label !== null && obj.label !== undefined &&`${obj.label}`.trim() !== '') return true;

    // fallback: non-empty object
    return Object.keys(obj).length > 0;
  }

  return false;
}

private isQuestionsValid(): boolean {
  // if you have only one question via question getter
  const q = this.question;
  if (!q) return true;

  if (!q.requiredFlag) return true;

  // any option selected?
  return !!q.pwQuestionOptionDTOs?.some((o: any) => o.selected === true);
}

isSubmitEnabled(): boolean {
  // 1) agreement must be checked
  if (!this.agreementForm || this.agreementForm.invalid) return false;

  // 2) form must exist
  if (!this.createPollworkerForm) return false;

  // 3) all REQUIRED fields from screenNames must have values
  const requiredFields = (this.screenNames() || []).filter(x => x?.requiredFlag);

  for (const f of requiredFields) {
    const ctrl = this.createPollworkerForm.get(f.fieldName);

    // if control not present => treat as not complete
    if (!ctrl) return false;

    if (!this.hasValue(ctrl.value)) return false;

    // also enforce validator state if any
    if (ctrl.invalid) return false;
  }

  // 4) required questions must be answered (not in form)
  if (!this.isQuestionsValid()) return false;

  return true;
}

}
    