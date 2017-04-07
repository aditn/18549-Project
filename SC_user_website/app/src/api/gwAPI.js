import CommonApi from './commonApiClass';

/**
 *  Gw api touchpoint
 */
class GateWay extends CommonApi {
  constructor(config) {
    super(config);
    this.includedTypes = {
      device: 'device',
      store: 'devicelocation',
      project: 'project'
    };
  }

  urlConstructor(type) {
    let url;
    // As default, you may pass a string, or self-defined comparable class instance
    switch (type) {

      case this.includedTypes.device:
      case 'device':
        url = this.includedTypes.device;
        break;

      case this.includedTypes.store:
      case 'store':
        url = this.includedTypes.store;
        break;

      case this.includedTypes.project:
      case 'project':
        url = this.includedTypes.project;
        break;
      case 'area':
        url = 'project';
        break;
      case 'province':
        url = 'md/province';
        break;
      case 'city':
        url = 'md/city';
        break;
      case 'county':
        url = 'md/county';
        break;
      default:
        console.error('Unmatched type being passed to gwAPI');
        break;
    }
    return '/' + url;
  }
  get(type, id) {
    let url = this.urlConstructor(type);
    if (type === 'city') {
      url += '?provinceId=%25' + id + '%25';
    }else if (type === 'county') {
      url += '?cityId=%25' + id.substring(0, 4) + '%25';
    }else if (id !== undefined && url !== undefined) {
      url += '/' + id.toString();
    }
    return this.call('GET', url);
  }
  getAll(type) {
    return this.get(type);
  }
  create(type, objData) {
    const url = this.urlConstructor(type);
    if (objData === undefined || url === undefined) {
      console.error('undefined behavior in create');
    }
    return this.call('POST', url, objData);
  }
  update(type, objData) {
    const url = this.urlConstructor(type);
    if (objData === undefined || url === undefined) {
      console.error('undefined behavior in update');
    }
    return this.call('PATCH', url, objData);
  }
  delete(type, id) {
    let url = this.urlConstructor(type);
    if (id !== undefined && url !== undefined) {
      url += '/' + id.toString();
    }
    return this.call('DELETE', url);
  }
}

export default GateWay;
