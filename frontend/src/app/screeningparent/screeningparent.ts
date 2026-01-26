import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input, signal, untracked } from '@angular/core';
import { DataModelDTO, UserDTOLoc } from '../model';
import { OKTA_AUTH } from '@okta/okta-angular';
import { Helpservice } from '../helpservice';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_END_POINT } from '../endpoint';

@Component({
  selector: 'app-screeningparent',
  imports: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './screeningparent.html',
  styleUrl: './screeningparent.scss',
})
export class Screeningparent {
protected localityInfo = input<UserDTOLoc>(new UserDTOLoc);
protected accessToken = input<string>('');
public readonly show = signal<true|false>(false);
private oktaAuth = inject(OKTA_AUTH);
protected internalCode = input<string>('');
public type = signal<DataModelDTO | null>(null);
public dataModel=input<DataModelDTO|null>(null);
constructor(private helpService:Helpservice,private httpClient:HttpClient) {
  this.show.set(false);
    // The effect will run immediately and every time myInput() changes
    effect(() => {
      const currentValue:UserDTOLoc = this.localityInfo();
      // const accessToken:string = this.accessToken();
      // Use untracked() if you have operations that don't need to trigger further effects or change detection
      // untracked(() => {
        // console.log('Input changed:', currentValue);
        if(currentValue !== undefined && currentValue !== null && currentValue.localityId !== undefined && currentValue.localityId != null){
        this.helpService.setLocalityInfo(currentValue);
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

  getType(event:any)
  {
    if(event.detail.create){
    // this.showCreate.set(true);
    }
    if(event.detail.editData&& event.detail.type){
      // this.showCreate.set(true);
      // this.editDetails.set(event.detail.editData);  
    }
  }
}
