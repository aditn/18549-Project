// Reflux!
import Reflux from 'reflux';
import moment from 'moment';
// The actoins
import ControlActions from '../reflux-actions/controlActions';
// Load constants
import _CONST from '../constants/RedKnifeConstants';

const DateStore = Reflux.createStore({
  listenables: [ControlActions],
  data: {
    cur_scale: _CONST.defaultScaleOption,
    cur_scope: {
      start: '',
      end: moment().clone()
    }
  },
  getInitialState() {
    return this.data
  },
  getCurrentDate(){
    return this.data;
  },
  getCurrentScope() {
    return this.data.cur_scope;
  },
  getCurrentScale() {
    return this.data.cur_scale;
  },
  getCurrentScaleInDays() {
    if (this.data.cur_scope.start == '') {
      // Not initialized yet
      console.warn('Starting date is not yet defined, returning 7 for scale');
      return 7;
    }
    return moment.duration(this.data.cur_scope.end.diff(this.data.cur_scope.start)).asDays();
  },
  getPreviousDate(date, scale) {
    var result = date.clone();
    switch (scale.name) {
      case 'week':
        result.subtract(7, 'days');
        break;
      case 'month':
        result.subtract(1, 'months');
        break;
      case 'trimonth':
        result.subtract(3, 'months');
        break;
      case 'year':
        result.subtract(1, 'years');
        break;
      default:
        break;
    }
    return result;
  },
  /**
   * This function calculates start date based on given data
   */
  calculateScopeBasedOnEnd() {
    switch (this.data.cur_scale.name) {
      case _CONST.scaleOptions.week.name:
        this.data.cur_scope.start = this.data.cur_scope.end.clone().subtract(7, 'days');
        break;
      case _CONST.scaleOptions.month.name:
        this.data.cur_scope.start = this.data.cur_scope.end.clone().subtract(1, 'months');
        break;
      case _CONST.scaleOptions.trimonth.name:
        this.data.cur_scope.start = this.data.cur_scope.end.clone().subtract(3, 'months');
        break;
      case _CONST.scaleOptions.year.name:
        this.data.cur_scope.start = this.data.cur_scope.end.clone().subtract(1, 'years');
        break;
      default:
        break;
    };
    this.trigger(this.data);
  },
  onInitDate() {
    // When init is called, we calculate the start date again based on end
    this.calculateScopeBasedOnEnd();
  },
  onScaleChange(change) {
    this.data.cur_scale = change;
    this.calculateScopeBasedOnEnd();
  },
  onScopeStartChange(newDate) {
    this.data.cur_scope.start = newDate;
    this.calculateScopeBasedOnEnd();
  },
  onScopeEndChange(newDate) {
    this.data.cur_scope.end = newDate;
    this.calculateScopeBasedOnEnd();
  }
})

export default DateStore;
