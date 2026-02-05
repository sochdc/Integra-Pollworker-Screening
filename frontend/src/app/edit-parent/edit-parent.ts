import { Component, CUSTOM_ELEMENTS_SCHEMA, effect, inject, input, signal } from '@angular/core';
import { DataModelDTO, IncidentManagementSystemDTO, screenName, UserDTOLoc } from '../model';
import { OKTA_AUTH } from '@okta/okta-angular';
import { Helpservice } from '../helpservice';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_END_POINT } from '../endpoint';
import { Background37 } from '../background37/background37';
import { EditPollworker } from '../edit-pollworker/edit-pollworker';

@Component({
  selector: 'app-edit-parent',
  imports: [],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './edit-parent.html',
  styleUrl: './edit-parent.scss',
})
export class EditParent {

  
}
