class CommonApi {

  constructor(config) {
    if(typeof config.url != 'string'){
      throw "Unusable config being fed";
    }
    this._baseUrl = config.url;
    this.token = config.token;
  }

  call(method, url, objData) {

    if(method == undefined){
      // Default method
      method = 'GET';
    }
    if(url == undefined){
      // No url? No problem.
      return null;
    }
    let r = {
      type: method,
      dataType : 'json',
      crossDomain : true,
      contentType : 'application/json; charset=utf-8',
      processData : false,
    };
    if (this.token !== undefined){
      if(url.indexOf('?') !== -1){
        r.url = this._baseUrl + url + '&token='+this.token;
      }else{
        r.url = this._baseUrl + url + '?token='+this.token;
      }
    }else{
      r.url = this._baseUrl + url;
    }
    if (method == "POST" || method == "PATCH"){
      r.data = JSON.stringify(objData);
    }
    return $.ajax(r);
  }
}

export default CommonApi;
