// Reflux!
import Reflux from 'reflux';
// DateStore
import AggregatedStore from '../AggregatedStore';
// Load constants
import _CONST from '../../constants/RedKnifeConstants';
// api connection point
import API_wrap from '../../api/apiWrapper.js';

// dwData depends on date changes, so we listen to DateStore
const TotalDWStore = Reflux.createStore({
  data: [],
  init() {
    this.listenTo(AggregatedStore, 'onAggreChange');
  },
  onAggreChange(newAggre){
    let {from,to,dimension,filter} = API_wrap.resolveAggre(newAggre);
    API_wrap.getDwAndVluv(from,to,dimension,filter,
      (data)=>{
        this.data = data;
        this.emit();
      });
  },
  emit() {
    this.trigger(this.data);
  }
});

export default TotalDWStore;
