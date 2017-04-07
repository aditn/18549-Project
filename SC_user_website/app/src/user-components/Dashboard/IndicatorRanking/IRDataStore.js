// Reflux!
import Reflux from 'reflux';

// Listen to specific data stores
import MultiDataStore from '../../../reflux-stores/APIdataStores/multiDataStore.js';
// Also need to get scale
import DateStore from '../../../reflux-stores/dateStore.js';
// Load constants
import _CONST from '../../../constants/RedKnifeConstants';
// API data utils to help manipulate data
import ApiDataUtil from '../../../api/apiDataUtil.js';

// IRDataStore listens to multiData and fetch those data
const IRDataStore = Reflux.createStore({
  data: {
    general: [],
    previous:[],
    day : 1
  },
  getInitialState() {
    return this.data
  },
  init() {
    this.listenTo(MultiDataStore,'onMultiDataChange');
    this.listenTo(DateStore, 'onDateChange');
  },
  onDateChange(date){
    this.data.day = DateStore.getCurrentScaleInDays();
    this.emit();
  },
  onMultiDataChange(data){
    this.data.general = data.general;
    this.data.previous = data.previous;
    this.emit();
  },
  emit() {
    this.trigger(this.data);
  }
});

export default IRDataStore;
