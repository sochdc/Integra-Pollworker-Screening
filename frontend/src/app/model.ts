export class UserDTOLoc {
  userId: number | null = null;
  loginId: string | null = null;
  password: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  phoneNumber: string | null = null;
  emailId: string | null = null;
  title: string | null = null;
  fipsCode: string | null = null;
  isLocality: boolean | null = null;
  localityCode: string | null = null;
  localityName: string | null = null;
  applicationId: number | null = null;
  grId: number | null = null;
  adminPollworker: boolean | null = null;
  adminpollworkerLocality: string | null = null;
  adminPollworkerAppId: number | null = null;
  adminPollworkerGrId: number | null = null;
  localityId: number | null = null;
  grLocalityName: string | null = null;
  customFields: Array<LocalityPwCustomFieldsDTO> | null = null;
  token: any | null = null;
}

export class LocalityPwCustomFieldsDTO {
  public LocalityPwCustomFieldsId: number | null = null;
  public fieldName: String | null = null;
  public requiredFlag: Boolean | null = null;
  public activeFlag: boolean | null = null;
  public localityId: number | null = null;
  public displayName: string | null = null;
  public userName: String | null = null;
}

export class DataModelDTO {
	public  datamodelId:number|null=null;
	public  dataModelName:string|null=null;
	public  createdBy:string|null=null;
	public  createdTs:Date|null=null;
	public  updatedBy:string|null=null;
	public  updatedTs:Date|null=null;
	public  dataModelUniqueId:string|null=null;
	public  localityIds:Array<number>|null=null;
  public  screenType:string='';
  public  apiEndPoint:string|null='';
	public  enableExport:boolean=false;
	public  enableGrouping:boolean=false;
	public  enableCharts:boolean=false;
}
export interface screenName {
  activeFlag: boolean;
  dataModelName: string;
  dataModelUniqueId: string;
  displayName: string;
  fieldName: string;
  fieldType: string;
  localityDataModelFieldId: number;
  localityId: string;
  requiredFlag: boolean;
  maxLength: number;
  minLength: number;
  orderNumber: number;
  pattern: string;
  subItems?: screenName[];
}
export class GRLocationsDTO {
  public grLocationId: number|null=null;;

  public locationName: string|null=null;;

  public street1: string|null=null;;

  public street2: string|null=null;;

  public city: string|null=null;;

  public state: string|null=null;;

  public zipcode: string|null=null;;

  public phoneNumber: string|null=null;;

  public activeFlag: boolean|null=null;;

  public createdBy: string|null=null;;

  public updatedBy: string|null=null;;

  public generalRegistrarDTO: GeneralRegistrarDTO|null=null;;

  public grLocationContactDTOs: Array<GRLocationContactDTO>|null=null;;

  public mailingAddress1: string|null=null;;

  public mailingAddress2: string|null=null;;

  public mailingCity: string|null=null;;

  public mailingState: string|null=null;;

  public mailingZipCode: string|null=null;;

  public workPhone: string|null=null;;

  public emailAddress: string|null=null;;

  public workHoursDTOs: Array<WorkHoursDTO>|null=null;

  public voterEntrance: string|null=null;;

  public accessibleEntrance: string|null=null;;

  public  adaSpecialSupplies: string|null=null;;

  public  whoOpenLocation: string|null=null;;

  public  keyPossession: string|null=null;;

  public  code: string|null=null;;

  public  accessNote: string|null=null;;

  public  roomNumber: string|null=null;;

  public  roomCapacity: number|null=null;;

  public  onSiteStorage: string|null=null;;

  public  electionOfficeNotes: string|null=null;;

  public  electionWorkerNotes: string|null=null;;

  public  tearDownNotes: string|null=null;;

  public  deliveryNotes: string|null=null;;

  public  epEvCodes: string|null=null;;

  public  fieldSupervisors: string|null=null;;

  public  fees: string|null=null;;

  public  certificateOfInsurance: string|null=null;;

  public  extension: string|null=null;;

  public precinctCheifDTOs:Array<PrecinctCheifDTO>|null=null;
  public specialSupplies: string|null=null;;
  public parcelPickUpDate: string|null=null;;
  public parcelDropOfDate: string|null=null;;
  public keyPossessionType: string|null=null;;
  public barCode:any;
  public  longitude:string|null=null;
  public  latitude:string|null=null;
}

export class GRDTO {
  public generalRegistrarId: number|null=null;
}
export class GeneralRegistrarDTO {
  public generalRegistrarId: number|null=null;

  public description: string|null=null;

  public applicationId: number|null=null;

  public address1: string|null=null;

  public address2: string|null=null;

  public city: string|null=null;

  public state: string|null=null;

  public zipCode: string|null=null;

  public accronym: string|null=null;

  public regionDTO: RegionDTO|null=null;

  public grContactDTOs: Array<GRContactDTO>|null=null;

  public ebContactDTOs: Array<GRContactDTO>|null=null;

  public itContactDTOs: Array<GRContactDTO>|null=null;

  public createdBy: string|null=null;;

  public updatedBy: string|null=null;;

  public createdTs: Date|null=null;;

  public updatedTs: Date|null=null;;

  public vendorsDTOs: Array<VendorsDTO>|null=null;
  public noOfPrecincts: number|null=null;;

  public votingSystemInventory: Array<GREquipmentVendorDTO>|null=null;

  public pollBookInventory: Array<GREquipmentVendorDTO>|null=null;

  public backUpVotingSystemInventory: Array<GREquipmentVendorDTO>|null=null;

  public equipment: GREquipmentVendorDTO|null=null;

  public equipments: Array<GREquipmentVendorDTO>|null=null;
  public subName:string|null=null;;
  public welcomeName:string|null=null;;

}

export class RegionDTO {
  public grRegionId: number|null=null;
  public regionName: string|null=null;
}
export class GRContactDTO {
  public grContactId: number|null=null;;

  public firstName: string|null=null;

  public lastName: string|null=null;;
  public middleName: string|null=null;;

  public emailAddress: string|null=null;;

  public personalEmailAddress: string|null=null;;

  public officePhone: string|null=null;;

  public cellPhone: string|null=null;;

  public faxNumber: string|null=null;;

  public termExpiresDt: Date|null=null;;

  public activeFlag: boolean|null=null;;

  public grTitleDTO: GRTitleDTO|null=null;

  public createdBy: string|null=null;;

  public updatedBy: string|null=null;;

  public createdTs: Date|null=null;;

  public updatedTs: Date|null=null;
}

export class PrecinctCheifDTO {

  public  precinctChiefId:number|null=null;

  public  activeFlag:boolean|null=null;

  public  pollWorkerDTO:PollWorkerDTO|null=null;

  public  grPrecinctDTO:GRPrecinctDTO|null=null;
  public generalRegistrarId:number|null=null;
  public duplicateFlag:boolean|null=null;
  public grLocationsDTO:GRLocationsDTO|null=null;
}


export class GRPrecinctDTO {
  public grPrecinctId: number|null=null;
  public precinctName: string|null=null;
  public precinctId: string|null=null;
  public grLocationsDTOs: Array<GRLocationsDTO>|null=null;
  public createdBy: string|null=null;
  public updatedBy: string|null=null;
  public createdTs: Date|null=null;
  public updatedTs: Date|null=null;
  public activeFlag: Boolean|null=null;
  public generalRegistrarDTO: GeneralRegistrarDTO|null=null;;
  public precinctCheifDTOs:Array<PrecinctCheifDTO>|null=null;
  public grLocationsDTO: GRLocationsDTO|null=null;
  public registeredVoters: number|null=null;

}


export class GRLocationContactDTO {
  grLocationContactId: number|null=null;
  firstName: string|null=null;
  lastName: string|null=null;
  emailAddress: string|null=null;
  cellPhone: string|null=null;
  workPhone:string|null=null;
  extension:string|null=null;
  activeFlag: Boolean|null=null;
  createdBy: string|null=null;
  updatedBy: string|null=null;
  createdTs: Date|null=null;
  updatedTs: Date|null=null;
  grLocationsDTO: GRLocationsDTO|null=null;
  grLocationContactTypeDTO: GRLocationContactTypeDTO|null=null;
  public checked: boolean|null=null;
  public contactType:string|null=null;
}

export class GRLocationContactTypeDTO {
  public contactTypeId: number|null=null;
  public name: string|null=null;
  public activeFlag: boolean|null=null;
}


export class GRTitleDTO {
  public grTitleId: number|null=null;

  public titleName: string|null=null;;

  public grTitleTypeDTO: GRTitleTypeDTO|null=null;;
}
export class GRTitleTypeDTO {
  public grTitleTypeId: number|null=null;;

  public typeName: string|null=null;
}

export class WorkHoursDTO {
  public  workHoursId: number|null=null;
  public  openTm: string|null=null;;
  public  closeTm: string|null=null;;
  public  createdBy: string|null=null;;
  public  createdTs: Date|null=null;;
  public  updatedBy: string|null=null;;
  public  updatedTs: Date|null=null;;
  public  day: string|null=null;;
  public  closed: Boolean|null=null;;
  public grLocationsDTO: GRLocationsDTO|null=null;
}

export class PollWorkerDTO {
  pollworkerId:any|null=null;
  requestId:any|null=null;
  firstName:any|null=null;
  lastName:any|null=null;
  middleName:any|null=null;
  createdBy:any|null=null;
  updatedBy:any|null=null;
  suffix:any|null=null;
  phoneNumber:any|null=null;
  workNumber:any|null=null;
  homeNumber:any|null=null;
  emailId:any|null=null;
  secondaryEmailId:any|null=null;
  activeFlag:any|null=null;
  address1:any|null=null;
  address2:any|null=null;
  city:any|null=null;
  state:any|null=null;
  zipCode:any|null=null;
  reqSubmittedDt:any|null=null;
  dob:any|null=null;
  dayOfBirth:any|null=null;
  monthOfBirth:any|null=null;
  yearOfBirth:any|null=null;
  ssn:any|null=null;
  contactPreferenceDTO:any|null=null;
  primaryLanguageOther:any|null=null;
  agreeTerms:any|null=null;
  primaryLanguageDTO:any|null=null;
  secondaryLanguageOther:any|null=null;
  secondaryLanguageDTO:any|null=null;
  electionPartiesDTO:any|null=null;
  localityDTO:any|null=null;
  gender:any|null=null;
  pollWorkerStatusDTO:any|null=null;
  generalQAs: any;
  miscellaneousQAs: any;
  notes:any|null=null;
  pwDecisionStatusDTO: PWDecisionStatusDTO|null=null;
  pwOtherInformation:any|null=null;
  complaints:any|null=null;
}

export class PWDecisionStatusDTO {
  pwDecisionStatusId:any|null=null;
  name:any|null=null;
}



export class VendorsDTO {
  vendorId: number|null=null;
  name: string|null=null;;
  createdBy: string|null=null;;
  createdTs: Date|null=null;;
  updatedBy: string|null=null;;
  updatedTs: Date|null=null;;
  vendorAddress: any|null=null;;
  vendorContact: any|null=null;;
  vendorContactDTOs: Array<any>|null=null;;
  vendorCertificateDTO: any|null=null;;
}
export class GREquipmentVendorDTO extends VendorsDTO {
  public grEquipmentVendorId: number|null=null;
  public purchaseYear: number|null=null;
  public grEquipmentSolutionsDTOs: Array<any>|null=null;
  public activeFlag: boolean|null=null;
  public backupInd: boolean|null=null;
  public quantity: Number|null=null;
  public submitted: boolean|null=null;
  public selected :boolean|null=null;
}

// User Preference DTOs matching backend Java structure
export class UserPreferenceDTO {
  userPreferenceId: number | null = null;
  displayName: string | null = null;
  activeFlag: boolean | null = null;
  createdBy: string | null = null;
  createdTs: Date | null = null;
  updatedBy: string | null = null;
  updatedTs: Date | null = null;
  preferenceString: string | null = null; // JSON string containing preference data
  defaultView: boolean | null = null;
  userId: number | null = null;
  dataModelId: number | null = null;
  dataModelUniqueId: string | null = null;
}

export class UserPreferenceResponseDTO {
  displayName: string | null = null;
  activeFlag: boolean | null = null;
  createdBy: string | null = null;
  createdTs: Date | null = null;
  updatedBy: string | null = null;
  updatedTs: Date | null = null;
  preferenceString: Array<UserPreferenceItemDTO> | null = null; // Array of preference items
  defaultView: boolean | null = null;
  userId: number | null = null;
  dataModelId: number | null = null;
  dataModelUniqueId: string | null = null;
  userPreferenceId: number | null = null;
}

export class UserPreferenceItemDTO {
  userPreferenceId: number | null = null;
  activeFlag: number | null = null;
  CREATED_TS: string | null = null;
  displayName: string | null = null;
  preferenceStr: string | null = null; // JSON string with column state
  dataModelId: number | null = null;
  userId: number | null = null;
  locality_datamodel_id: number | null = null;
}

export class CategoryDTO{

  public  categoryId:number =0;
  public  localityId:number =0;
  public  categoryName:string|null=null;
  public  activeFlag:string|null=null;
}

export class IncidentManagementSystemDTO {
public  incidentManagementId:number|null=null;
 //public  incidentManagementId:number=0;
  public  locationType:string|null=null;
  public  locationId:number|null=null;
  public  locationName:string|null=null;
 public  issueDescription:string|null=null;
  public  electionName:string|null=null;
  public  localityElectionId:number|null=null;
 public  equipmentType:string|null=null;
 public  equipmentName:string|null=null;
  public  equipmentInventoryId:number|null=null;
 public  pCategoryDTO:CategoryDTO|Array<any>|null=null;
  public  sCategoryDTO:CategoryDTO|Array<any>|null=null;
  public  irmStatusDTO:IRMStatusDTO|Array<any>|null=null;
  public  urgencyDTO:UrgencyDTO|Array<any>|null=null;
 public  impactDTO:ImpactDTO|Array<any>|null=null;
 public  contactMethodDTO:ContactMethodDTO|Array<any>|null=null;
  public  incidentPriorityDTO:IncidentPriorityDTO|Array<any>|null=null;
  public  localityId:number=0;
 public  activeFlag:boolean=false;
  public  pollworkerId:number|null=null;
 public  pollWorkerDTO:PollWorkerDTO|Array<any>|null=null;
  public  trackingId:string|null=null;
  public comments:string|null=null;
  public  resolutionSummary:string|null=null;
  public  rootCause:string|null=null;
  public  createdBy:string|null=null;
  public  updatedBy:string|null=null;
 public  fileUploadData:string|null=null;
  public assignmentGroupDTO:AssignmentGroupDTO|Array<any>|null=null;
  public incidentAssignmentGroupDTOs:any|null=null;
  public localityName:string|null=null;
}
export class IRMStatusDTO{

  public  statusId:number=0;
  public  localityId:number=0;
  public  statusName:string|null=null;
}
export class UrgencyDTO {
  public  urgencyId:number=0;
  public  localityId:number=0;
  public  urgencyName:string|null=null;
  public  activeFlag:boolean=false;
}
export class ImpactDTO {
  public  impactId:number=0;
  public  localityId:number=0;
  public  impactName:string|null=null;
  public  activeFlag:boolean=false;
}
export class ContactMethodDTO {

  public  contactMethodId:number=0;
  public  localityId:number=0;
  public  contactMethodName:string|null=null;
  public  activeFlag:boolean=false;

}
export class AssignmentGroupDTO{
  public  assignmentGroupId:number=0;
  public  localityId:number=0;
  public  assignmentGroupName:string|null=null;
  public  activeFlag:boolean=false;
}

export class IncidentPriorityDTO {
  public  incidentPriorityId:number=0;
  public  localityId:number=0;
  public  incidentPriorityName:string|null=null;
  public  activeFlag:boolean=false;
} 


