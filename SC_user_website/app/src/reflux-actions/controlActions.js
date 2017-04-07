import Reflux from 'reflux';

// Use these actions to trigger events
const ControlActions = Reflux.createActions([
  // Date actions
  'initDate',
  'scopeStartChange',
  'scopeEndChange',
  'scaleChange',

  // Geo actions
  'initGeo',
  'geoAreaChange',
  'geoProvinceChange',
  'geoCityChange',
  'geoCountyChange',
  'geoStoreChange',

  // Use this to set current project
  'curProjectChange',
  // Project, store, device
  // Use init to get all, the rest is as its names
  'initProject',
  'getProject',
  'updateProject',
  'createProject',
  'deleteProject',

  'initStore',
  'getStore',
  'updateStore',
  'createStore',
  'deleteStore',

  'initDevice',
  'getDevice',
  'updateDevice',
  'createDevice',
  'deleteDevice',

  // Global message
  'sendMessage',
]);

export default ControlActions;
