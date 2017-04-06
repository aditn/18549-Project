// Reflux!
import Reflux from 'reflux';

// Listen to specific data stores
import DwDataStore from '../../../reflux-stores/APIdataStores/dwDataStore.js';
import UDStore from '../../../reflux-stores/APIdataStores/udStore.js';
// Loader realted store
import DateStore from '../../../reflux-stores/dateStore.js';
// Load constants
import _CONST from '../../../constants/RedKnifeConstants';
// API data utils to help manipulate data
import ApiDataUtil from '../../../api/apiDataUtil.js';

const OverallKpiDataStore = Reflux.createStore({
  data: {
    visitPeriod : {
      isLoading : true,
      data:[]
    },
    averageStall:{
      isLoading : true,
      data: []
    }
  },
  getInitialState() {
    return this.data
  },
  init() {
    this.listenTo(UDStore, 'onUDChange');
    this.listenTo(DwDataStore,'onDwChange');
    // In the end we also listen to dateStore for showing loading screen
    this.listenTo(DateStore,'onDateChange');
  },
  onDateChange(){
    this.setLoading();
  },
  setLoading(){
    this.data.visitPeriod.isLoading = true;
    this.data.averageStall.isLoading = true;
    this.emit();
  },
  onDwChange(data){
    this.data.averageStall.isLoading = false;
    this.data.averageStall.data = data;
    this.emit();
  },
  onUDChange(data){
    this.data.visitPeriod.isLoading = false;
    this.data.visitPeriod.data = data.general;
    this.emit();
  },
  emit() {
    this.trigger(this.data);
  }
});

export default OverallKpiDataStore;
