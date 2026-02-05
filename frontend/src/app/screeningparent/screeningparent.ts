import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, EventEmitter, inject, Input, input, Output, signal, untracked } from '@angular/core';
import { DataModelDTO, IncidentManagementSystemDTO, PollWorkerDecisionDetails, screenName, UserDTOLoc } from '../model';
import { OKTA_AUTH } from '@okta/okta-angular';
import { Helpservice } from '../helpservice';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_END_POINT } from '../endpoint';
import { Background37 } from '../background37/background37';
import { CreatePollworker } from '../create-pollworker/create-pollworker';
import { CommonModule } from '@angular/common';
import { EditParent } from '../edit-parent/edit-parent';
import { EditPollworker } from '../edit-pollworker/edit-pollworker';

@Component({
  selector: 'app-screeningparent',
  imports: [Background37,CreatePollworker, CommonModule,EditPollworker,EditParent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './screeningparent.html',
  styleUrl: `./screeningparent.scss`,
})

export class Screeningparent {
protected localityInfo = input<UserDTOLoc>(new UserDTOLoc);
protected accessToken = input<string>('');
public readonly show = signal<true|false>(false);
private oktaAuth = inject(OKTA_AUTH);
protected internalCode = input<string>('');
public type = signal<DataModelDTO | null>(null);
public dataModel=input<DataModelDTO|null>(null);
public status=signal<any|null>(null);
public dd = signal<Array<screenName> | null>(null);
public selectedIncidentDto = signal<PollWorkerDecisionDetails| null>(null);
public showCreate = signal<true | false>(false);
 @Input() isOpen: boolean = false;
@Output() showType = new EventEmitter<any>();
public showEdit= signal<true | false>(false);
public editDetails = signal<any>(null);
constructor(private helpService:Helpservice,private httpClient:HttpClient) {
  this.show.set(false);
    // The effect will run immediately and every time myInput() changes
    effect(() => {
      const currentValue:UserDTOLoc = this.localityInfo();

        if(currentValue !== undefined && currentValue !== null && currentValue.localityId !== undefined && currentValue.localityId != null){
        this.helpService.setLocalityInfo(currentValue);
        this.getDecisions();
        this.show.set(true);
        }
      
    });
}
 getTabs() {
    let url = APP_CONFIG_END_POINT.getTabInfo;
    this.httpClient.get<DataModelDTO[]>(url + "/" + this.internalCode() + "/" + this.localityInfo().localityId)
      .subscribe({
        next: (data: Array<DataModelDTO>) => {
          if (data && data.length > 0) {

            this.type.set(data[0]);
            this.show.set(true);

          }
        }, error: (error) => {
          console.log(error);
        }
      })
  }
    getDataModels() {

    let url = APP_CONFIG_END_POINT.getDataModelByLocalityAndName;
    this.httpClient.get<screenName[]>(url + "/" + this.dataModel()?.dataModelUniqueId + "/" + this.localityInfo().localityId + "/F")
      .subscribe({
        next: (data: Array<screenName>) => {
          if (data) {
            console.log("data models:",data);

            this.dd.set(data);
        //    this.showCreate.set(true);
           // this.showEdit.set(true);
          }

        }, error: (error) => {
          console.log(error);
        }
      })
  }

  getType(event:any)
  {
    console.log('showEdit before:', this.showEdit());
    console.log('SHOW TYPE EVENT:', event);
    if(event?.detail?.create){
      this.getDataModels();
      this.showCreate.set(true);
    this.showEdit.set(false);
    return;
    }
    if(event?.detail?.editData){
       this.editDetails.set(event.detail.editData);
       this.getDataModels();
       this.showCreate.set(false);
      this.showEdit.set(true);
      
    }
  } 
  clear()
  {
    this.showCreate.set(false);
    this.showEdit.set(false);
  }
  onCreate(event:any)
  {
    this.showCreate.set(false);
    this.showEdit.set(false);
    this.show.set(false);
    setTimeout(()=>{
      this.show.set(true);
    },100)
  }
onEdit(row: any) {
  this.showType.emit({
    editData: row
  });
}
    getDecisions()
     {
       let url=APP_CONFIG_END_POINT.getPollWorkersDecisionCountJson;
       this.httpClient.get(url+"/"+this.helpService.localityInfo().localityId)
       .subscribe({
         next:(data:any)=>{
           if(data != undefined && data != null)
           {
             this.status.set(data);
           }
         },error:(error)=>{
           console.log(error);
         }
       })
     }
   
     getFirst(name:string)
     {
       if(name)
         return name.substring(0,1);
       return ''
     }


}
