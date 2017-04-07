// Reflux!
import Reflux from 'reflux';

// Listen to specific data stores
import UDStore from '../../../reflux-stores/APIdataStores/udStore.js';
import TotalDWStore from '../../../reflux-stores/APIdataStores/totalDwStore.js';
// Load constants
import _CONST from '../../../constants/RedKnifeConstants';
// Loader realted store
import DateStore from '../../../reflux-stores/dateStore.js';

// API data utils to help manipulate data
import ApiDataUtil from '../../../api/apiDataUtil.js';

const SPDataStore = Reflux.createStore({
  data: {
    cqwidget: {
      isLoading: true,
      data: []
    },
    cfwidget: {
      isLoading: true,
      data: []
    },
    ccwidget: {
      isLoadingUd: true,
      isLoadingDw: true,
      data: {
        ud: {
          general: [],
          previous: []
        },
        additional: {}
      }
    }
  },
  getInitialState() {
    return this.data
  },
  init() {
    this.listenTo(UDStore, 'onUDChange');
    this.listenTo(TotalDWStore, 'onDwChange');
    // In the end we also listen to dateStore for showing loading screen
    this.listenTo(DateStore, 'onDateChange');
  },
  onDateChange() {
    this.setLoading();
  },
  setLoading(){
    // Set all to loading
    this.data.cqwidget.isLoading = true;
    this.data.cfwidget.isLoading = true;
    this.data.ccwidget.isLoadingUd = true;
    this.data.ccwidget.isLoadingDw = true;

    this.emit();
  },
  onDwChange(data) {
    // Links to additional
    this.data.ccwidget.isLoadingDw = false;
    if(data.length == 0){
      this.data.ccwidget.data.additional = {};
    }else if(data.length == 1){
      this.data.ccwidget.data.additional = data[0];
    }else{
      console.error('Unparsed data in ccwidget in spDataStore : ');
      console.log(data);
    }
    this.emit();
  },
  onUDChange(data) {
    // Links to all
    this.data.cfwidget.isLoading = false;
    this.data.cfwidget.data = data;

    this.data.cqwidget.isLoading = false;
    this.data.cqwidget.data = data;

    this.data.ccwidget.isLoadingUd = false;
    this.data.ccwidget.data.ud = data;
    this.emit();
  },
  emit() {
    this.trigger(this.data);
  }
});

export default SPDataStore;
