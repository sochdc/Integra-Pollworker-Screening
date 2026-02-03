
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  EventEmitter,
  Input,
  input,
  Output,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import {
  LocalityDTO,
  MonthObject,
  monthsList,
  PollWorkerDTO,
  PollWorkerQuestionDTO,
  //primaryLanguageList,
  primaryLanguageObject,
  PwQuestionsDTO,
  screenName,
 // secondaryLanguageList,
  secondaryLanguageObject,
  StateObject,
  statesList,
} from '../model';

import { Helpservice } from '../helpservice';
import { ScreeningService } from '../screening-service';

@Component({
  selector: 'app-create-pollworker',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './create-pollworker.html',
  styleUrl: './create-pollworker.scss',
})
export class CreatePollworker {
  // -------- Inputs / Outputs --------
  screenNames = input<Array<screenName>>([]);
  public fieldObject = input<screenName | null>(null);
  public displayName = input<string>('');
  isClose = output<any>();

  @Output() eventInputData = new EventEmitter<any>();
  @Output() eventInputData1 = new EventEmitter<any>();

  @Input() questions: any[] = [];
  @Input() indexValue!: number;
  @Input() editValue: any = null;

  // -------- Forms --------
  public createPollworkerForm: FormGroup | null = null;
  agreementForm!: FormGroup;

  // -------- Signals / State --------
  public readonly show = signal<boolean>(false);

  public states = signal<Array<StateObject>>([]);
  public months = signal<Array<MonthObject>>([]);
  public days = signal<{ name: string; value: string }[]>([]);
  public primaryLanguage = signal<Array<primaryLanguageObject>>([]);
  public secondaryLanguage = signal<Array<secondaryLanguageObject>>([]);

  public showContact = signal<true | false>(false);
  public showSsn = signal<boolean>(false);
  public modelValue = signal<any>(null);
showMailingState = signal(true);
  public applicationId: number = 0;
  // -------- Gender --------
  public genderOptions = signal<{ name: string; value: string }[]>([
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' },
    { name: 'Other', value: 'Other' },
  ]);

  // -------- PW Load data --------
  pwLoadData = signal<any>(null);
generalQuestions = signal<any[]>([]);
showAgreementError = false;
isAgreementAccepted = false;

  // -------- Children map (parentPwQuestionId -> children[]) --------
  childQuestionsMap = signal<Record<number, any[]>>({});
  PollWorkerQuestionDTO: any;
  invalidControls: any;
  electionparty: any;
  generalQuestionsfaq: any;

  get question() {
    return this.questions?.[this.indexValue];
  }
  public pwQuestions=signal<Array<PollWorkerQuestionDTO>|null>([]);

  constructor(
    private fb: FormBuilder,
    private helpService: Helpservice,
    private screeningService: ScreeningService,
    private cdr: ChangeDetectorRef
  ) {
    this.states.set(statesList);
    this.months.set(monthsList);
    //this.primaryLanguage.set(primaryLanguageList);
    //this.secondaryLanguage.set(secondaryLanguageList);

    effect(() => {
      this.applicationId = this.helpService.localityInfo().applicationId!;
      this.getPWLoadMethodData();

      const one = this.screenNames();
      if (one) {
        this.createPollworkerForm = this.fb.group({});
        this.buildForm();
          

        const month = this.createPollworkerForm?.get('monthOfBirth')?.value;
        const year = this.createPollworkerForm?.get('yearOfBirth')?.value;

        if (!month || (month === 'feb' && !year)) {
          this.days.set([]);
        } else {
          this.updateDaysDropdown();
        }
      }

      this.modelValue.set(this.editValue ?? null);
    });
  }

  ngOnInit(): void {
    this.agreementForm = this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  // -------------------- API Load --------------------
  getPWLoadMethodData() {
    this.screeningService.getPWLoadData(this.applicationId).subscribe({
      next: (pwQuestion: any) => {
        console.log('PW Load response:', pwQuestion);

        this.pwLoadData.set(pwQuestion);
        this.pwQuestions.set(pwQuestion.pwQuestionsDTO.generalQAs);

        // reset children whenever main data reloads
        this.childQuestionsMap.set({});

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('PW Load API error:', error);
      },
    });
  }

  // -------------------- Children helpers --------------------
  getChildren(parentPwQuestionId?: number): any[] {
    if (!parentPwQuestionId) return [];
    return this.childQuestionsMap()?.[parentPwQuestionId] ?? [];
  }

  private setChildren(parentPwQuestionId: number, kids: any[]) {
    const curr = this.childQuestionsMap();
    this.childQuestionsMap.set({ ...curr, [parentPwQuestionId]: kids });
  }

  private clearChildren(parentPwQuestionId: number) {
    const curr = this.childQuestionsMap();
    const copy = { ...curr };
    delete copy[parentPwQuestionId];
    this.childQuestionsMap.set(copy);
  }

  // -------------------- Radio mapping helpers --------------------
  toRadioOptions(opts: any[] = []) {
    return (opts ?? []).map((o: any) => ({
      name: o.name,
      value: o.pwQuestionOptionId,
    }));
  }

  getSelectedOptionId(q: any): number | null {
    const selected = q?.pwQuestionOptionDTOs?.find((o: any) => o.selected === true);
    return selected ? selected.pwQuestionOptionId : null;
  }

  // -------------------- Main selection handler (parent + child) --------------------
  onSelectQuestion(event: any,parentPwQuestion:PollWorkerQuestionDTO ) {
    if(event.detail&&event.detail.partyName)
{
  this.electionparty=event.detail
}
if(event.detail&&event.detail.pwQuestionOptionId){
  this.generalQuestionsfaq= event.detail
}

/*
    const selectedOptionIdRaw =
      event?.detail?.pwQuestionOptionId ??
      event?.detail?.value ??
      event?.detail ??
      event?.pwQuestionOptionId ??
      event?.value ??
      event;

   console.log('event details:',event.detail)
   if(event?.detail?.partyName){
    //this.createPollworkerForm?.get('electionPartiesDTO');
    this.electionparty =event?.detail?.partyName;
   }
if(parentPwQuestion.childExists){
  parentPwQuestion.pwQuestionOptionDTO=event.detail;
    this.screeningService.getChildQuestion(parentPwQuestion).subscribe({
      next: (res: any) => {
        const childBlock = res?.childQAsDTO ?? {};
        // handle multiple possible shapes safely
            const kids =
          childBlock?.generalQAs ??
          childBlock?.childQAs ??
          childBlock?.questions ??
          [];


        const kidsArr = Array.isArray(kids) ? kids : [];
       // this.setChildren(q.pwQuestionId, kidsArr);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('[CHILD API ERROR]', err);
      //  this.clearChildren(q.pwQuestionId);
      },
    });
  }else{
  //  this.clearChildren(q.pwQuestionId);
  }*/
  }

  // -------------------- Build form from screenNames --------------------
  buildForm() {
    console.log(this.screenNames());
    const something = [
    "dob",
    "electionPartiesDTO",
    "localityDTO",
    "countyId",
    "termStartDt",
    "termEndDt",
    "grPrecinctDTO",
    "pwTitleDTO",
    "countySiteId",
    "voterId",
    "preferredName",
    "createdBy",
    "electionDayFlag",
    "earlyVotingFlag",
    "prePostFlag",
    "electionExperience",
    "phoneNumber",
    "pwGrade",
    "ewsFlag"
]
    this.screenNames().forEach((fieldData: any) => {
      fieldData.requiredFlag = true;

      const conditionalValidators: ValidatorFn[] = [];

      if (fieldData.requiredFlag && !something.includes(fieldData.fieldName)) {
        conditionalValidators.push(Validators.required);

        if (fieldData.minLength) conditionalValidators.push(Validators.minLength(fieldData.minLength));
        if (fieldData.maxLength) conditionalValidators.push(Validators.maxLength(fieldData.maxLength));
      }

      if (fieldData.fieldName === 'emailId') {
        conditionalValidators.push(Validators.email);
      }

      this.createPollworkerForm?.addControl(
        fieldData.fieldName,
        new FormControl(null, conditionalValidators)
      );
    });
    console.log('createPollworkerForm', this.createPollworkerForm);
  }

  // -------------------- Field helpers --------------------
  getFiledObject(type: string): screenName {
    if (this.screenNames) {
      return this.screenNames().filter((x) => x?.fieldName == type)[0];
    }
    return null!;
  }

 

  getFieldValue(type: string): any {
    const val = this.createPollworkerForm ? this.createPollworkerForm.get(type)?.value : null;
    return val ? val : null;
  }

  // -------------------- Days dropdown logic --------------------

isYearFilled(): boolean {
  const year = this.createPollworkerForm?.get('yearOfBirth')?.value;
  return year !== null && year !== undefined && String(year).trim().length > 0;
}

isMonthFilled(): boolean {
  const month = this.createPollworkerForm?.get('monthOfBirth')?.value;
  return month !== null && month !== undefined && String(month).trim().length > 0;
}
blockMonthClick() {
  console.log('Blocked: Month cannot be selected until Year is entered');
}

blockDayClick() {
  console.log('Blocked: Day cannot be selected until Year + Month are selected');
}
saveData(type: string, event: any) {
  const value = event?.detail ?? event;

  // Year
  if (type === 'yearOfBirth') {
    this.createPollworkerForm?.get('yearOfBirth')?.setValue(value);
    this.createPollworkerForm?.get('yearOfBirth')?.markAsDirty();
    this.createPollworkerForm?.get('yearOfBirth')?.updateValueAndValidity({ emitEvent: false });

    // If year cleared -> reset month/day and days list
    if (!this.isYearFilled()) {
      this.createPollworkerForm?.get('monthOfBirth')?.setValue(null);
      this.createPollworkerForm?.get('dayOfBirth')?.setValue(null);
      this.days.set([]);
    }

    this.cdr.detectChanges();
    return;
  }

  // Block month/day save if year missing
  if (type === 'monthOfBirth' && !this.isYearFilled()) {
    this.createPollworkerForm?.get('monthOfBirth')?.setValue(null);
    this.createPollworkerForm?.get('dayOfBirth')?.setValue(null);
    this.days.set([]);
    this.cdr.detectChanges();
    return;
  }

  // Month
  if (type === 'monthOfBirth') {
    this.createPollworkerForm?.get('monthOfBirth')?.setValue(value);
    this.createPollworkerForm?.get('monthOfBirth')?.markAsDirty();
    this.createPollworkerForm?.get('monthOfBirth')?.updateValueAndValidity({ emitEvent: false });

    // reset day whenever month changes
    this.createPollworkerForm?.get('dayOfBirth')?.setValue(null);
    this.updateDaysDropdown();

    this.cdr.detectChanges();
    return;
  }

  // Block day save if year/month missing
  if (type === 'dayOfBirth' && (!this.isYearFilled() || !this.isMonthFilled())) {
    this.createPollworkerForm?.get('dayOfBirth')?.setValue(null);
    this.cdr.detectChanges();
    return;
  }

  // Default
  this.createPollworkerForm?.get(type)?.setValue(value);
  this.createPollworkerForm?.get(type)?.markAsDirty();
  this.createPollworkerForm?.get(type)?.updateValueAndValidity({ emitEvent: false });
}

  updateDaysDropdown() {
    const month = this.createPollworkerForm?.get('monthOfBirth')?.value;
    const year = +this.createPollworkerForm?.get('yearOfBirth')?.value;

    if (!month || !year) {
      this.days.set([]);
      return;
    }

    let numDays = 31;
    if (['apr', 'jun', 'sep', 'nov'].includes(month)) numDays = 30;
    else if (month === 'feb') {
      numDays = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }

    const dayList = Array.from({ length: numDays }, (_, i) => ({
      name: (i + 1).toString(),
      value: (i + 1).toString(),
    }));

    this.days.set(dayList);
  }

  

private rerenderMailingState() {
  this.showMailingState.set(false);
  setTimeout(() => this.showMailingState.set(true));
}
getAddress(event: any) {
  const checked = !!(event?.detail ?? event);

  if (checked) {
    this.createPollworkerForm?.get('mailingAddress1')?.setValue(this.createPollworkerForm?.get('address1')?.value);
    this.createPollworkerForm?.get('mailingAddress2')?.setValue(this.createPollworkerForm?.get('address2')?.value);
    this.createPollworkerForm?.get('mailingCity')?.setValue(this.createPollworkerForm?.get('city')?.value);
    this.createPollworkerForm?.get('mailingState')?.setValue(this.createPollworkerForm?.get('state')?.value);
    this.createPollworkerForm?.get('mailingZipCode')?.setValue(this.createPollworkerForm?.get('zipCode')?.value);
  } else {
    this.createPollworkerForm?.get('mailingAddress1')?.setValue(null);
    this.createPollworkerForm?.get('mailingAddress2')?.setValue(null);
    this.createPollworkerForm?.get('mailingCity')?.setValue(null);

    this.createPollworkerForm?.get('mailingState')?.setValue(null);
      this.createPollworkerForm?.get('mailingState')?.updateValueAndValidity({ emitEvent: false });
      this.rerenderMailingState();
    this.createPollworkerForm?.get('mailingState')?.reset(null);
    this.createPollworkerForm?.get('mailingZipCode')?.setValue(null);
     this.createPollworkerForm?.get('mailingState')?.markAsPristine();
  this.createPollworkerForm?.get('mailingState')?.markAsUntouched();
  //this.createPollworkerForm?.get('mailingState')?.updateValueAndValidity({ emitEvent: false });

    this.days?.set?.([]); 
  }

  console.log('Mailing sync:', checked, this.createPollworkerForm?.value);

  // ✅ prime components sometimes need one more tick
  this.cdr.detectChanges();
  setTimeout(() => this.cdr.detectChanges());
}
  // -------------------- Close / Cancel / Submit --------------------
  handleCancel(): void {
    this.isClose.emit(true);
  }

  clearCreate() {
    this.showContact.set(false);
  }

  // -------------------- Non-radio answers --------------------
  onTextAnswer(q: any, event: any) {
    const value = event?.detail ?? event;
    q.answerText = value;
    console.log('[TEXT ANSWER]', { pwQuestionId: q?.pwQuestionId, value });
  }

  onDropdownAnswer(q: any, event: any) {
    const value = event?.detail ?? event;
    q.selectedOption = value;
    console.log('[DROPDOWN ANSWER]', { pwQuestionId: q?.pwQuestionId, value });
  }
  
setSaveData(pw: PollWorkerDTO) {
  pw.firstName = this.createPollworkerForm?.get('firstName')?.value ?? null;
  pw.middleName = this.createPollworkerForm?.get('middleName')?.value ?? null;
  pw.lastName = this.createPollworkerForm?.get('lastName')?.value ?? null;
//phone
  pw.phoneNumber = this.createPollworkerForm?.get('workNumber')?.value ?? null;
  pw.homeNumber = this.createPollworkerForm?.get('homeNumber')?.value ?? null;
  pw.emailId = this.createPollworkerForm?.get('emailId')?.value ?? null;

  pw.gender = this.createPollworkerForm?.get('gender')?.value.name ?? null;
  //year, month,day,electionPartiesDTO
  pw.yearOfBirth = this.createPollworkerForm?.get('yearOfBirth')?.value ?? null;
  pw.monthOfBirth = this.createPollworkerForm?.get('monthOfBirth')?.value.value ?? null;
  pw.dayOfBirth = this.createPollworkerForm?.get('dayOfBirth')?.value.name ?? null;

  pw.ssn = this.createPollworkerForm?.get('ssn')?.value ?? null;
  pw.address1 = this.createPollworkerForm?.get('address1')?.value ?? null;
  pw.address2 = this.createPollworkerForm?.get('address2')?.value ?? null;
  pw.city = this.createPollworkerForm?.get('city')?.value ?? null;
  pw.state = this.createPollworkerForm?.get('state')?.value.code ?? null;
  pw.zipCode = this.createPollworkerForm?.get('zipCode')?.value ?? null;

  pw.mailingAddress1 = this.createPollworkerForm?.get('mailingAddress1')?.value ?? null;
  pw.mailingAddress2 = this.createPollworkerForm?.get('mailingAddress2')?.value ?? null;
  pw.mailingCity = this.createPollworkerForm?.get('mailingCity')?.value ?? null;
  pw.mailingState = this.createPollworkerForm?.get('mailingState')?.value.code?? null;
  pw.mailingZipCode = this.createPollworkerForm?.get('mailingZipCode')?.value ?? null;
    pw.agreeTerms =
    this.createPollworkerForm?.get('agreeTerms')?.value ?? false;
  pw.primaryLanguageDTO = 
    this.createPollworkerForm?.get('primaryLanguageDTO')?.value;

  pw.secondaryLanguageDTO =
    this.createPollworkerForm?.get('secondaryLanguageDTO')?.value;
  console.log('election:',this.createPollworkerForm?.get('electionPartiesDTOs')?.value)
    //electionPartiesDTO
  pw.electionPartiesDTOs =
this.electionparty;
//localityDTO
pw.localityDTO=new LocalityDTO();
  pw.localityDTO!.localityId = this.helpService.localityInfo().localityId!;
  pw.localityDTO.name=this.helpService.localityInfo().localityName;

  pw.generalQAs =this.pwQuestions();
    //this.createPollworkerForm?.get('generalQAs')?.value ?? [];
    // this.generalQuestionsfaq;

  pw.miscellaneousQAs =
    this.createPollworkerForm?.get('miscellaneousQAs')?.value ?? [];
  pw.agreeTerms =
    this.createPollworkerForm?.get('agreeTerms')?.value ?? false;

  pw.activeFlag = true;
  pw.createdBy =
    this.helpService.localityInfo().firstName + ' ' +
    this.helpService.localityInfo().lastName;

}


onSend() {
  if (!this.createPollworkerForm?.valid || !this.agreementForm?.valid) {

    this.createPollworkerForm?.markAllAsTouched();
    this.agreementForm?.markAllAsTouched();

    console.log('[INVALID FORM]', {
      createPollworkerForm: this.createPollworkerForm,
      agreementForm: this.agreementForm,
    });

    return;
  }
  const pollWorker = new PollWorkerDTO();
  this.setSaveData(pollWorker);

  this.screeningService.savePollWorker(pollWorker).subscribe({
    next: (res: any) => {
      console.log('[SAVE SUCCESS]', res);
      this.show.set(true);
    },
    error: (err: any) => {
      console.error('[SAVE ERROR]', err);
    }
  });
}
onAgreementChange(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.isAgreementAccepted = checked;
  this.showAgreementError = !checked;
  const acceptTermsControl = this.agreementForm?.get('acceptTerms');
  acceptTermsControl?.setValue(checked);
  acceptTermsControl?.updateValueAndValidity();
}


}