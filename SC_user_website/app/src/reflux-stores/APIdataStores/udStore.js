// Reflux!
import Reflux from 'reflux';
// DateStore
import DateStore from '../dateStore';
import AggregatedStore from '../AggregatedStore';
// Load constants
import _CONST from '../../constants/RedKnifeConstants';
// api connection point
import API_wrap from '../../api/apiWrapper.js';

// UD depends on date changes, so we listen to DateStore
const UDStore = Reflux.createStore({
  data: {
    general: [],
    previous: []
  },
  init() {
    this.listenTo(AggregatedStore, 'onAggreChange');
  },
  onAggreChange(newAggre){
    let {from,to,dimension,filter} = API_wrap.resolveAggre(newAggre);

    let newDate = DateStore.getCurrentDate();
    let start = newDate.cur_scope.start;
    let end = newDate.cur_scope.end;

    let scale = newDate.cur_scale;

    let p_start = DateStore.getPreviousDate(start, scale);
    let p_end = DateStore.getPreviousDate(end, scale);
    let self = this;

    // These are our deferred objects
    let general_dtd = $.Deferred();
    let previous_dtd = $.Deferred();

    function get(g_dtd, p_dtd, callback) {

      API_wrap.getUd(from,to,dimension,filter,
        (data)=>{
          self.data.general = data;
          g_dtd.resolve();
        });

      API_wrap.getUd(
        p_start.format(_CONST.dateFormat),
        p_end.format(_CONST.dateFormat),dimension,filter,
        (data)=>{
          self.data.previous = data;
          p_dtd.resolve();
        });

      $.when(g_dtd, p_dtd).then(function() {
        // Success, just emit
        callback();
      }, function() {
        // Failed, put failed in data and then emit
        self.data = {
          general: 'FAILED',
          previous: 'FAILED'
        };
        callback();
      });

      return;
    }
    get(general_dtd, previous_dtd, this.emit);
    return;
  },
  emit() {
    this.trigger(this.data);
  }
});

export default UDStore;
