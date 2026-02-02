import { environment } from '../environments/environment';

const baseUrl = window.location.origin + environment.baseUrl;
//const baseUrl = window.location.origin + '/IntegraLocality/services/';
const apiBaseUrl = baseUrl;
// const docUrl = window.location.origin + environment.docUrl;

const electionURL = window.location.origin + environment.electionURL;
const invenUrl = window.location.origin+"/yantar/";
const irUrl = window.location.origin+"/ghatna/";
export const APP_CONFIG_END_POINT = {
   getResourcesOnName:apiBaseUrl+"getResourcesOnName",
   getfileData:apiBaseUrl+"getfile",
   incidentCreate:irUrl+"incident/save",
  incidentUpdate:irUrl+"incident/updateIncident",
  getIncident:irUrl+"incident",
  getIncidentsByLocality:irUrl+"incident/getIncidentsByLocality",
  getImpactByLocality:irUrl+"impact/getByLocality",
  getUrgencyByLocality:irUrl+"urgency/getByLocality",
  getStatusByLocality:irUrl+"status/getByLocality",
  getincidentPriority:irUrl+"incidentPriority/getByLocality",
  getIncidentsByLocalityList:irUrl+"incident/getIncidentsByLocalityList",
  contactMethod:irUrl+"contactMethod/getByLocality",
  category:irUrl+"category/getByLocality",
  getSubCategory:irUrl+"category/getSubCategory",
  assignmentGroup:irUrl+"assignmentGroup/getByLocality",
  assignGroup:irUrl+"incident/assignGroup",
  saveAssignee:irUrl+"incident/saveAssignee",
  saveIncidentFiles:irUrl+"incident/saveIncidentFiles",
  getMetaDataTags:irUrl+"getMetaDataTags",
  getFileForIncident:irUrl+"getFile",
  uploadQuilImage:baseUrl+"uploadQuilImage",
  getElections: baseUrl + 'getElections',
  getGRLocationsJSON: apiBaseUrl + "getGRLocationsJSON",
  getGRPrecinctsJSON: apiBaseUrl + "getGRPrecinctsJSON",
  getPollWorkers: baseUrl + 'getPollWorkers',
  getEquipmentInventory:invenUrl+"equipmentInvenory",
  getTabInfo:apiBaseUrl+"getTabInfo",
  getDataModelByLocalityAndName: apiBaseUrl + "getDataModelByLocalityAndName",
  getPWLoadData: apiBaseUrl + 'getPWLoadData',
  getPollWorkersDecisionCountJson:apiBaseUrl+"getPollWorkersDecisionCountJson",
 getChildQuestion: apiBaseUrl + 'getChildQuestion',

}      