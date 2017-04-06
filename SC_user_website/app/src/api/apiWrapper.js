import Reflux from 'reflux';
import MacReport from './macReportAPI.js';
import GateWay from './gwAPI.js';
import Auth from '../auth/auth.js';

const ApiCalls = {
  /*
  *
  *   ,----.   ,--.   ,--.
  *  '  .-./   |  |   |  |
  *  |  | .---.|  |.'.|  |
  *  '  '--'  ||   ,'.   |
  *   `------' '--'   '--'
  *
  */

  // Get
  getProjectById(id, callback) {
    this.gateWayApi.get('project', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getStoreById(id, callback) {
    return this.gateWayApi.get('store', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getDeviceById(id, callback) {
    return this.gateWayApi.get('device', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  // GET FOR Md
  getAreaBasedOnProjectId(id, callback) {
    return this.gateWayApi.get('area', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getAllProvince( callback) {
    return this.gateWayApi.get('province').then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getCityByProvinceId(id, callback) {
    return this.gateWayApi.get('city', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getCountyByCityId(id, callback) {
    return this.gateWayApi.get('county', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  // GetAll
  getAllProject(callback) {
    return this.gateWayApi.getAll('project').then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getAllDevice(callback) {
    return this.gateWayApi.getAll('device').then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  getAllStore(callback) {
    return this.gateWayApi.getAll('store').then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  // Update
  updateProjectByObj(obj, callback) {
    return this.gateWayApi.update('project', obj).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  updateStoreByObj(obj, callback) {
    return this.gateWayApi.update('store', obj).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  updateDeviceByObj(obj, callback) {
    return this.gateWayApi.update('device', obj).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  // Create
  createProjectByObj(obj, callback) {
    return this.gateWayApi.create('project', obj).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  createStoreByObj(obj, callback) {
    return this.gateWayApi.create('store', obj).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  createDeviceByObj(obj, callback) {
    return this.gateWayApi.create('device', obj).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  // Delete
  deleteProjectById(id, callback) {
    return this.gateWayApi.delete('project', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  deleteStoreById(id, callback) {
    return this.gateWayApi.delete('store', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  deleteDeviceById(id, callback) {
    return this.gateWayApi.delete('device', id).then(function(data){
      callback(data);
    }, function(error){callback()});
  },
  /*
  *
  *                          ,------.                               ,--.
  *  ,--,--,--. ,--,--. ,---.|  .--. ' ,---.  ,---.  ,---. ,--.--.,-'  '-.
  *  |        |' ,-.  || .--'|  '--'.'| .-. :| .-. || .-. ||  .--''-.  .-'
  *  |  |  |  |\ '-'  |\ `--.|  |\  \ \   --.| '-' '' '-' '|  |     |  |
  *  `--`--`--' `--`--' `---'`--' '--' `----'|  |-'  `---' `--'     `--'
  *                                          `--'
  */
  /**
   * If I have geo, start_date, and end_date
   * The data I need to render current Componnents correctly includes:
   *
   * Overview:
   *  aioGraph : dayPv
   *  dotComparision : multidata
   *  macDist : geoData
   *
   * StorePerformance :
   *  customerFlowWidget : (This one does not use previous date data)
   *     1. totalPv (type = 0,1,2,15)
   *     2. totalUv (type = 0,1,2,15)
   *     3. tpv_ratio
   *     4. inStorePv (type = 0,1,2,15)
   *     5. inStoreUv (type = 0,1,2,15)
   *     6. ipv_ratio
   *  CustomerConversionWidget: (This one would require getting data from previous date)
   *     1. dw (AverageStall)
   *     2. longstay
   *     3. p_longstay
   *     4. deep (longstay / inStorePv)
   *     5. p_deep
   *     6. shortstay
   *     7. p_shorstay
   *     8. jump (shortstay/inStorePv)
   *     9. p_jump
   *  CustomerQualityWidget: userDimension
   * OverallKpi :
   *  AverageStall : dw (by type)
   *  VisitPeriod :
   *     1. time period(This is given)
   *     2. vpv - shortstay
   *     3. vuv
   * IndicatorRanking: multidata
   *
   * Thus, the API calls I need(should make) are:
   *   1. dayPv
   *   2. multidata
   *   3. userDimension
   *   4. dwByDate
   */
  resolveAggre(newAggre) {
    if (newAggre.from === undefined ||
      newAggre.to === undefined ||
      newAggre.dimension === undefined ||
      newAggre.dimension.project === undefined ||
      newAggre.filter === undefined ||
      newAggre.filter.project === undefined ) {
      console.error('AggregatedStore passed in wrong formateed data');
      console.error(newAggre);
    }
    let resolvedDim = "", resolvedFil="";
    if (newAggre.dimension.project) {
      resolvedDim += 'project';
      resolvedFil += `${newAggre.filter.project}`;
    }
    if (newAggre.dimension.district) {
      resolvedDim += ',district';
      resolvedFil += `and ${newAggre.filter.district}`;
    }else if (newAggre.dimension.city) {
      resolvedDim += ',city';
      resolvedFil += `and ${newAggre.filter.city}`;
    }else if (newAggre.dimension.province) {
      resolvedDim += ',pro vince';
      resolvedFil += `and ${newAggre.filter.province}`;
    }

    return {
      from: newAggre.from,
      to: newAggre.to,
      dimension: resolvedDim,
      filter: resolvedFil
    };
  },
  /* Added geo as a parameter for api calls */
  /* Simply connect to geo store and make */
  /*
  * mac_report.customCall(args)
  * args = from, to , dimension, kpi, filter
  * customCall will automatically add
  * parameter name to the url so simply pass everything as string
  */
  getDayPv(from, to, dimension, filter, callback) {
    // PV by date
    this.macReportAPI.customCall(
      from,
      to,
      `date,${dimension}`,
      'vpv',
      filter)
    .then(function(data){callback(data);}, function(error) {});
  },
  getMultiData(from, to, dimension, filter, callback) {
    this.macReportAPI.customCall(
      from,
      to,
      `type,ap,${dimension}`,
      'pv,vpv,uv,vuv,shortstay,longstay,dw,vluv',
      filter)
      .then(function(data) {callback(data);}, function(error) {});
  },
  getUd(from, to, dimension, filter, callback) {
    this.macReportAPI.customCall(
      from,
      to,
      `type,${dimension}`,
      'pv,vpv,uv,vuv,shortstay,longstay',
      filter)
      .then(function(data) {callback(data);}, function(error) {});
  },
  getAllGeoData(from, to, dimension, filter, callback) {
    this.macReportAPI.customCall(
      from,
      to,
      `${dimension}`,
      null,
      filter)
      .then(function(data) {callback(data);}, function(error) {});
  },
  // filter = "type lt '3'"
  getDw(from, to, dimension, filter, callback) {
    this.macReportAPI.customCall(
      from,
      to,
      `type,date,${dimension}`,
      'dw,vluv',
      filter)
      .then(function(data) {callback(data);}, function(error) {});
  },
  getDwAndVluv(from, to, dimension, filter, callback) {
    this.macReportAPI.customCall(
      from,
      to,
      dimension,
      'dw,vluv',
      filter)
      .then(function(data) {callback(data);}, function(error) {});
  }
};

const ApiWrapper = Reflux.createStore({
  init() {
    for (const fn in ApiCalls) {
      if (ApiCalls.hasOwnProperty(fn)) {
        this[fn] = ApiCalls[fn];
      }
    }
    this.listenTo(Auth, 'onAuthChange');
  },
  onAuthChange(newAuth) {
    // Create these two instances only after auth is done
    this.macReportAPI = new MacReport({
      url: 'http://svr.digitwalk.com/gw/mac_report'
    });
    this.gateWayApi = new GateWay({
      url: 'http://svr.digitwalk.com/gw/s',
      token: newAuth.token
    });
  },
});

export default ApiWrapper;
