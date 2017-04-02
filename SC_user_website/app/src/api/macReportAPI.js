import CommonApi from './commonApiClass';
/**
 * MacReportAPI touchpoint
 */
class MacReport extends CommonApi {

  constructor(config) {
    super(config)
  }
  // from, to are both string formated date '20151014' is an example
  // dimension can be : project, type, ap, date
  // use filter to add project
  urlConstructor(from, to, dimension, kpi, filter) {
    let url = '',
      temp = '';
    if (typeof(from) == 'string') {
      temp = '&from=' + from;
      url += temp;
    }
    if (typeof(to) == 'string') {
      temp = '&to=' + to;
      url += temp;
    }
    if (typeof(dimension) == 'string') {
      temp = '&dimension=' + dimension;
      url += temp;
    }
    if (typeof(kpi) == 'string') {
      temp = '&kpi=' + kpi;
      url += temp;
    }
    if (typeof(filter) == 'string') {
      temp = '&filter=' + escape(filter);
      url += temp;
    }
    // Replace the first & to ? for url
    url = url.replace('&', '?');
    return url;
  }

  customCall(from, to, dimension, kpi, filter) {
    let requestUrl = this.urlConstructor(from, to, dimension, kpi, filter);
    return this.call('GET', requestUrl);
  }
}

export default MacReport;
