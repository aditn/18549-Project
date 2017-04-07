// Reflux!
import Reflux from 'reflux';
// When these store emits, they directly affect APIdataStores
import DateStore from './dateStore';
import GeoStore from './geoStore';
import ProjectStore from './projectStore';

// Load constants
import _CONST from '../constants/RedKnifeConstants';
// api connection point
import API_wrap from '../api/apiWrapper.js';

/**
* Very basic idea of extracting.
* Since every APIdataStore pretty much share listeners
* and they pretty much all change when one of
* DateStore, GeoStore, ProjectStore changes,
* I am pulling all liteners out and handle data transformation here
* Note:
*   DateStore -> from , to
*   GeoStore  -> filter will add province/area/city eq something ...(Id of area)
*   ProjectStore -> filter will add project eq something ...(Id of project)
*/
const AggregatedStore = Reflux.createStore({
  data : {
    from      : "",
    to        : "",
    dimension : {
      project   : false,
      district  : false,
      city      : false,
      province  : false,
    },
    // No kpi becasue kpi is special to each APIdataStore
    filter    : {
      project   : '',
      district  : '',
      city      : '',
      province  : '',
    },
  },
  init() {
    this.listenTo(DateStore,    'onDateChange'    );
    this.listenTo(GeoStore,     'onGeoChange'     );
    this.listenTo(ProjectStore, 'onProjectChange' );
  },
  onDateChange(newDate) {
    const start       = newDate.cur_scope.start;
    const end         = newDate.cur_scope.end;
    this.data.from = start.format(_CONST.dateFormat);
    this.data.to   = end.format(_CONST.dateFormat);
    this.emit();
  },
  onGeoChange(newGeo) {
    const selected = newGeo.selected;
    if (selected.county) {
      this.data.dimension.district  = true;
      this.data.filter.district     = `district eq '${selected.county.id}'`;
    }else if (selected.city) {
      this.data.dimension.city      = true;
      this.data.filter.city         = `city eq '${selected.city.id}'`;
    }else if (selected.province) {
      this.data.dimension.province  = true;
      this.data.filter.province     = `province eq '${selected.province.id}'`;
    }
    // Area is not not implemented in API
    this.emit();
  },
  onProjectChange(newProject) {
    this.data.dimension.project = true;
    this.data.filter.project = `project eq '${newProject.cur_project.name}'`;
    this.emit();
  },
  emit() {
    if (!this.data.dimension.project) {
      return;
    }
    this.trigger(this.data);
  }
});

export default AggregatedStore;
