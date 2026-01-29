import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, Input, input, signal, untracked } from '@angular/core';
import { DataModelDTO, IncidentManagementSystemDTO, screenName, UserDTOLoc } from '../model';
import { OKTA_AUTH } from '@okta/okta-angular';
import { Helpservice } from '../helpservice';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_END_POINT } from '../endpoint';
import { Background37 } from '../background37/background37';
import { CreatePollworker } from '../create-pollworker/create-pollworker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-screeningparent',
  imports: [Background37,CreatePollworker, CommonModule],
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
public selectedIncidentDto = signal<IncidentManagementSystemDTO | null>(null);
public showCreate = signal<true | false>(false);
 @Input() isOpen: boolean = false;



constructor(private helpService:Helpservice,private httpClient:HttpClient) {
  this.show.set(false);
    // The effect will run immediately and every time myInput() changes
    effect(() => {
      const currentValue:UserDTOLoc = this.localityInfo();
      console.log(currentValue);
      // const accessToken:string = this.accessToken();
      // Use untracked() if you have operations that don't need to trigger further effects or change detection
      // untracked(() => {
        // console.log('Input changed:', currentValue);
        if(currentValue !== undefined && currentValue !== null && currentValue.localityId !== undefined && currentValue.localityId != null){
        this.helpService.setLocalityInfo(currentValue);
        this.getDecisions();
        this.show.set(true);
        }
        //this.getTabs();
        // console.log('Input changed:', accessToken);
      //    if(accessToken !== undefined && accessToken !== null && accessToken?.length > 0){
      //   // this.helpService.setAccessToken(accessToken);
      // if(currentValue.localityId != null && accessToken?.length > 0)
      //    this.show.set(true);
    // }
    // else{
    //   // this.oktaAuth.signOut();
    // }
        // this.getAccessToken();
        // Perform actions like making an API call or updating the internal state
      // });
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
            this.showCreate.set(true);
          }

        }, error: (error) => {
          console.log(error);
        }
      })
  }

  getType(event:any)
  {
    if(event.detail.create){
      this.getDataModels();
    
    
    }
    if(event.detail.editData&& event.detail.type){
       this.getDataModels();
      // this.showCreate.set(true);
      //this.editDetails.set(event.detail.editData);  
    }
  } 
  
  clear()
  {
    this.showCreate.set(false);
  }
  onCreate(event:any)
  {
    this.showCreate.set(false);
    this.show.set(false);
    setTimeout(()=>{
      this.show.set(true);
    },100)
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
