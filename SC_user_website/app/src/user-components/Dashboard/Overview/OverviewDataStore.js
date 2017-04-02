// Reflux!
import Reflux from 'reflux';

// Listen to specific data stores
import DayPvStore from '../../../reflux-stores/APIdataStores/dayPvStore.js';
import DwDataStore from '../../../reflux-stores/APIdataStores/dwDataStore.js';
import MultiDataStore from '../../../reflux-stores/APIdataStores/multiDataStore.js';
import GeoDataStore from '../../../reflux-stores/APIdataStores/geoDataStore.js';
import UDStore from '../../../reflux-stores/APIdataStores/udStore.js';
// Loader realted store
import DateStore from '../../../reflux-stores/dateStore.js';
import GeoStore from '../../../reflux-stores/geoStore.js';

// Load constants
import _CONST from '../../../constants/RedKnifeConstants';

// API data utils to help manipulate data
import ApiDataUtil from '../../../api/apiDataUtil.js';

// You may consider this data store simply as
// an aggergation store
// that works similar to a reducer in mapReduce
const OverviewDataStore = Reflux.createStore({
  data: {
    aioGraph:{
      isLoading: true,
      data:{
        dayPv:[],
        dw:[]
      }
    },
    macDist:{
      isLoading: true,
      data:[]
    },
    cfwiget:{
      isLoading: true,
      data:[]
    },
    dotCmp :{
      isLoading: true,
      data:[]
    }
  },
  getInitialState() {
    return this.data
  },
  init() {
    // dayPv is a list
    this.listenTo(DayPvStore, 'onDayPvChange');
    this.listenTo(DwDataStore, 'onDwChange');
    // geo data is also a list
    this.listenTo(GeoDataStore, 'onGeoDataChange');
    // MultiData is another list
    this.listenTo(MultiDataStore, 'onMultiDataChange');
    // UDStore's data is an object with general and previous
    this.listenTo(UDStore, 'onUDChange');

    // In the end we also listen to date and geo data for showing loading screen
    this.listenTo(DateStore, 'onDateChange');
    this.listenTo(GeoStore, 'onGeoChange');
  },
  onDateChange(){
    this.setLoading('date');
  },
  onGeoChange (){
    this.setLoading('geo');
  },
  setLoading(type){
    if(type == 'date'){
      // We set date related views to loading
      this.data.aioGraph.isLoading = true;
      this.data.cfwiget.isLoading = true;
      this.data.dotCmp.isLoading = true;
      this.data.macDist.isLoading= true;
    }else{
      this.data.macDist.isLoading = true;
    }
    this.emit();
  },
  onDayPvChange(data) {
    // links to aioGraph
    // console.log('DayPv Changed');
    this.data.aioGraph.isLoading = false;
    this.data.aioGraph.data.dayPv = data;
    this.emit();
  },
  onDwChange(data){
    // links to aioGraph
    // console.log('dw changed');
    this.data.aioGraph.data.dw = data;
    this.emit();
  },
  onGeoDataChange(data) {
    // links to macDist
    this.data.macDist.isLoading = false;
    this.data.macDist.data = data;
    this.emit();
  },
  onMultiDataChange(data) {
    // links to dot cmp
    // console.log('multidata changed');
    this.data.dotCmp.isLoading = false;
    this.data.dotCmp.data = data.general;
    this.emit();
  },
  onUDChange(data) {
    // links to cfwigetData
    // console.log('UD changed');
    this.data.cfwiget.isLoading = false;
    this.data.cfwiget.data = data;
    this.emit();
  },
  emit() {
    this.trigger(this.data);
  }
});

export default OverviewDataStore;
