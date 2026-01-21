import { Injectable, input, signal } from '@angular/core';
import { UserDTOLoc } from './model';


@Injectable({
  providedIn: 'root',
})
export class Helpservice {

  public readonly localityInfo = signal<UserDTOLoc>(new UserDTOLoc);
  public readonly accessToken = signal<string>('');


  public setLocalityInfo(value:UserDTOLoc)
  {
    this.localityInfo.set(value);
  }

   public setAccessToken(value:string)
  {
    this.accessToken.set(value);
  }
  
}
