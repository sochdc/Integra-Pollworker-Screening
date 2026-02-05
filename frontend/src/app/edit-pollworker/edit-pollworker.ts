import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, Input, input, OnInit, output, signal } from '@angular/core';
import { ScreeningService } from '../screening-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Helpservice } from '../helpservice';
import { DataModelDTO, PollWorkerDecisionDetails, pwDecisionStatusDTO } from '../model';

@Component({
  selector: 'app-edit-pollworker',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './edit-pollworker.html',
  styleUrl: './edit-pollworker.scss',
})
export class EditPollworker {
  isClose = output<any>();

  // Inputs from parent
  datamodelId = input<number | null>(null);
  pollworkerId = input<number | null>(null);

  // API responses
  childDataModels = signal<DataModelDTO | null>(null);
  dataModelDetails = signal<DataModelDTO | null>(null);

  getInternalPollworkerDetails = signal<PollWorkerDecisionDetails | null>(null);
  pollworkerDetails = signal<PollWorkerDecisionDetails | null>(null);

  // PW Decision Statuses (LIST)
  pwStatusList = signal<pwDecisionStatusDTO[] | null>(null);

  // Optional: currently selected status id from pollworkerDetails
  selectedPwDecisionStatusId = signal<number | null>(null);

  // Guards to avoid duplicate calls
  private lastDataModelId: number | null = null;
  private lastPollworkerId: number | null = null;
  private lastLocalityId: number | null = null;

  constructor(
    private screeningService: ScreeningService,
    private helpService: Helpservice
  ) {
    // 1) Load child data models (may still 500 until backend fixes filter)
    effect(() => {
      const id = this.datamodelId();
      console.log('DataModel Id input:', id);

      if (id == null) return;
      if (this.lastDataModelId === id) return;
      this.lastDataModelId = id;

      this.getChildMethod(id);
    });

    // 2) Load pollworker decision details
    effect(() => {
      const pid = this.pollworkerId();
      console.log('Pollworker Id input:', pid);

      if (pid == null) return;
      if (this.lastPollworkerId === pid) return;
      this.lastPollworkerId = pid;

      this.getInterPollworkerMethod(pid);
    });

    // 3) After pollworker details are loaded, extract selected status id
    effect(() => {
      const details = this.pollworkerDetails();
      if (!details) return;

      const sid = details.pwDecisionStatusDTO?.pwDecisionStatusId ?? null;
      this.selectedPwDecisionStatusId.set(sid);
      console.log('Selected PW Decision Status Id (from pollworker):', sid);
    });

    // 4) Load PW Decision Statuses list using localityInfo() from Helpservice.
    effect(() => {
      const applicationId = this.getLocalityIdFromHelpService();
      console.log('Resolved localityId for getPWDecisionStatuses:', applicationId);

      if (applicationId == null) return;
      if (this.lastLocalityId === applicationId) return;
      this.lastLocalityId = applicationId;

      this.getPWStatusMethod(applicationId);
    });
  }

  // ---- LocalityId resolver (NO HARDCODE) ----
  private getLocalityIdFromHelpService(): number | null {
    const loc: any = this.helpService.localityInfo(); // signal read
    // Helpful debug (keep until stable)
    console.log('helpService.localityInfo() =>', loc);

    // Most common patterns: localityId or countySiteId
    const applicationId = loc?.applicationId;
    if (applicationId != null && Number.isFinite(Number(applicationId)) && Number(applicationId) > 0) {
      return Number(applicationId);
    }


    // If your UserDTOLoc uses a different key, you’ll see it in the log above.
    return null;
  }

  // ---- API Calls ----
  getPWStatusMethod(applicationId: number) {
    console.log('Calling getPWDecisionStatuses with applicationId:', applicationId);

    this.screeningService.getPWDecisionStatuses(applicationId).subscribe({
      next: (list: pwDecisionStatusDTO[]) => {
        console.log('PW Decision Status list response:', list);
        this.pwStatusList.set(list);

        // Optional: verify selected status exists in list
        const sid = this.selectedPwDecisionStatusId();
        if (sid != null) {
          const found = list?.some((x) => x?.pwDecisionStatusId === sid) ?? false;
          console.log('Selected status found in list:', found, 'sid=', sid);
        }
      },
      error: (error) => {
        console.error('getPWDecisionStatuses API error:', error);
      },
    });
  }

  getInterPollworkerMethod(pid: number) {
    console.log('Calling getInternalPollWorkerDecisionDetails with id:', pid);

    this.screeningService.getInternalPollWorkerDecisionDetails(pid).subscribe({
      next: (pollworkerDetails: PollWorkerDecisionDetails) => {
        console.log('getInternalpollworker response', pollworkerDetails);
        this.getInternalPollworkerDetails.set(pollworkerDetails);
        this.pollworkerDetails.set(pollworkerDetails);
      },
      error: (error) => {
        console.error('getInternalpollworker API error:', error);
      },
    });
  }

  getChildMethod(id: number) {
    console.log('Calling getChildDataModels with id:', id);

    this.screeningService.getChildDataModels(id).subscribe({
      next: (dataModelDetails: any) => {
        console.log('getChildDatamodel response:', dataModelDetails);
        this.childDataModels.set(dataModelDetails);
        this.dataModelDetails.set(dataModelDetails);
      },
      error: (error) => {
        console.error('getChildData Model API error:', error);
      },
    });
  }

  handleCancel(): void {
    this.isClose.emit(true);
  }  
}

  

