
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, effect, EventEmitter, inject, Injector, Input, input, Output, output, signal } from '@angular/core';
import { Background37 } from '../background37/background37';
import { MonthObject, monthsList, primaryLanguageList, primaryLanguageObject, screenName, secondaryLanguageList, secondaryLanguageObject, StateObject, statesList } from '../model';
import { CommonModule } from '@angular/common';
import {  FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
  providers:[],
  templateUrl: './create-pollworker.html',
  styleUrl: './create-pollworker.scss',
})
export class CreatePollworker {
 screenNames = input<Array<screenName>>([]);
  public createPollworkerForm: FormGroup | null = null;
    public readonly show = signal<boolean>(false);
electionPartyOptions = signal<{ name: string; value: number }[]>([]);
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
public applicationId: number =0;
    @Input() questions: any[] = [];
  @Input() indexValue!: number;
selectedGender: string = '';
  @Output() eventInputData1 = new EventEmitter<any>();
  @Input() editValue: any = null;
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
//Work
pwLoadData = signal<any>(null);
generalQuestions = signal<any[]>([]);
vaVoterQuestion = signal<any>(null);
vaVoterOptions = signal<{ name: string; value: any }[]>([]);
vaVoterSelected = signal<any>(null);

  constructor(private fb:FormBuilder,private helpService:Helpservice,
    private screeningService:ScreeningService,private cdr:ChangeDetectorRef){
   this.states.set(statesList);
   this.months.set(monthsList);
   this.primaryLanguage.set(primaryLanguageList);
   this.secondaryLanguage.set(secondaryLanguageList);

 effect(() => {
  this.applicationId = this.helpService.localityInfo().applicationId!;
  this.getPWLoadMethodData();


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
        this.screeningService.getPWLoadData(this.applicationId)
            .subscribe({
                next: (pwQuestion: any) => {
                  console.log("inside pw question is:",pwQuestion)
                  this.pwLoadData.set(pwQuestion);
                  const electionOptions = (pwQuestion.pwQuestionsDTO|| []).map(
    (party: any) => ({
      name: party.name,
      id: party.pwQuestionId
    })
  );
  this.electionPartyOptions.set(electionOptions); 
        const questions = pwQuestion?.pwQuestionsDTO?.generalQAs ?? [];
        this.generalQuestions.set(questions);
        const vaQuestion = questions.find(
          (q: any) =>
           q.pwQuestionId
        );
        this.vaVoterQuestion.set(vaQuestion);
        const options = (vaQuestion?.pwQuestionOptionDTOs ?? []).map((o: any) => ({
          name: o.name,
          value: o.pwQuestionOptionId,
        }));
       
        this.vaVoterOptions.set(options);
        const selected = vaQuestion?.pwQuestionOptionDTOs?.find(
          (o: any) => o.selected === true
        );
        this.vaVoterSelected.set(
          selected ? selected.pwQuestionOptionId : null
        );      
                },
                error: (error) => {
                   console.error('PW Load API error:',error);
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

  if(event.detail)
  {
    this.createPollworkerForm?.get('mailingAddress1')?.setValue(this.createPollworkerForm?.get('address1')?.value);
    this.createPollworkerForm?.get('mailingAddress2')?.setValue(this.createPollworkerForm?.get('address2')?.value);
    this.createPollworkerForm?.get('mailingCity')?.setValue(this.createPollworkerForm?.get('city')?.value);
    this.createPollworkerForm?.get('mailingState')?.setValue(this.createPollworkerForm?.get('state')?.value);
    this.createPollworkerForm?.get('mailingZipCode')?.setValue(this.createPollworkerForm?.get('zipCode')?.value);
  }
  else{
     this.createPollworkerForm?.get('mailingAddress1')?.setValue(null);
    this.createPollworkerForm?.get('mailingAddress2')?.setValue(null);
    this.createPollworkerForm?.get('mailingCity')?.setValue(null);
    this.createPollworkerForm?.get('mailingState')?.setValue(null);
    this.createPollworkerForm?.get('mailingZipCode')?.setValue(null);
  }
  console.log(this.createPollworkerForm?.value);
  this.cdr.detectChanges();
}
saveGender(event: any){
  console.log("event is :",event)

}
saveParty(type: string,event: any){
   this.createPollworkerForm?.get(type)?.setValue(event.detail);
     if (type == 'electionPartiesDTO') {
      let electionPartyId= this.electionPartyOptions().filter((x)=> {return x?.name == event.detail.name})[0];

          //  let categoryId = this.categoryData().filter((x) => { return x?.categoryName == event.detail.categoryName })[0]?.categoryId;
          //  this.getsubcategoryData(categoryId);
        }
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
saveVaVoter(event: any) {
  
  const selectedValue = event?.detail ?? event;
  
  const q = this.vaVoterQuestion();
  
  if (!q) return;
  this.vaVoterSelected.set(selectedValue);
  q.pwQuestionOptionDTOs?.forEach((o: any) => {
    o.selected = o.pwQuestionOptionId === selectedValue;
  });
  const selectedOpt = q.pwQuestionOptionDTOs?.find(
    (o: any) => o.pwQuestionOptionId === selectedValue
  );
  q.pwQuestionOptionDTO = selectedOpt
    ? {
        pwQuestionOptionId: selectedOpt.pwQuestionOptionId,
        name: selectedOpt.name,
        selected: true,
      }
    : null;
  console.log(' Selected option object:', selectedOpt);
  console.log(' Question AFTER update:', q);
  // refresh signal
  this.vaVoterQuestion.set({ ...q });
}

}
    
