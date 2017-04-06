// Reflux!
import Reflux         from 'reflux';
// The actoins
import ControlActions from '../reflux-actions/controlActions.js';
// Load constants
import _CONST         from '../constants/RedKnifeConstants.js';
import API_wrap       from '../api/apiWrapper.js';

const GeoStore = Reflux.createStore({
  listenables :   [ControlActions],
  data : {
    selected : {
      country     : 'CN',
      area        : '',
      province    : '',
      city        : '',
      county      : ''
    },
    allProvinces  : [],
    areas         : [],
    provinces     : [],
    citys         : [],
    countys       : []
  },
  getInitialState(){
    return this.data
  },
  getCurrentGeo(){
    return this.data;
  },
  resetLowerAndEmit(type){
    switch (type) {
      case 'all' :
        this.data.areas = [];
      case 'area':
        this.data.provinces = [];
      case 'province':
        this.data.citys = [];
      case 'city':
        this.data.county = [];
        break;
      default:
        break;
    }
    this.emit();
  },
  onInitGeo() {
    this.getAllProvince();
  },
  getAllProvince(){
    // This function will get all provinces data
    //  Useful for geo setting
    API_wrap.getAllProvince((data) => {
      if(data !== undefined){
        this.data.allProvinces = data;
      }
      this.emit();
    });
  },
  getProvinceFromArea(newArea){
    for(let region of this.data.areas){
      if(region.id == newArea.id){
        return region.provinces
      }
    }
    return [];
  },
  onGeoAreaChange(newArea){
    if(this.data.areas !== undefined){
      this.data.selected.area = newArea;
      this.data.provinces = this.getProvinceFromArea(newArea);
      this.resetLowerAndEmit('province');
    }
  },
  getNewAreaBaseOnProjectId(id){
    API_wrap.getAreaBasedOnProjectId(id,(data)=>{
      if(data == undefined || data.areas == undefined){
        console.warn('cannot load area data');
      }else{
        this.data.areas = data.areas;
        this.resetLowerAndEmit('area');
      }
    });
  },
  onGeoProvinceChange(newProvince){
    if(newProvince.id !== undefined){
      this.data.selected.province = newProvince;
      API_wrap.getCityByProvinceId(newProvince.id,(data)=>{
        if(data == undefined || data.length <= 0){
          console.error('cannot load city data');
        }else{
          this.data.citys = data;
          this.resetLowerAndEmit('city');
        }
      });
    }
  },
  onGeoCityChange(newCity){
    if(newCity.id !== undefined){
      this.data.selected.city = newCity;
      API_wrap.getCountyByCityId(newCity.id,(data)=>{
        if(data == undefined || data.length <= 0){
          console.error('cannot load city data');
        }else{
          this.data.countys = data;
          this.resetLowerAndEmit('county');
        }
      });
    }
  },
  onGeoCountyChange(newCounty){
    if(newCounty.id !== undefined){
      // simply set county and emit
      this.data.selected.county = newCounty;
      this.resetLowerAndEmit('county');
    }
  },
  onCurProjectChange(change){
    if(change.name == undefined){
      console.error('Trying to get data based on an unknown project');
    }
    // name stoers id. For more details see "buildAllProjectsBasedOnRaw" in
    // projectStore
    this.getNewAreaBaseOnProjectId(change.name);
  },
  emit(){
    this.trigger(this.data);
  }
});

export default GeoStore;
