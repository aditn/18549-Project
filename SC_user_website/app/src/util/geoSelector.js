import React from 'react';
import Reflux from 'reflux';

import ControlActions from '../reflux-actions/controlActions.js';
import GeoStore from '../reflux-stores/geoStore.js';

const GeoPopOver = React.createClass({
  propTypes: {
    onGeoAdded: React.PropTypes.func,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  },
  mixins: [
    Reflux.connect(GeoStore, 'geoData')
  ],
  getInitialState() {
    return {
      area: {
        id: '',
        name: ''
      },
      province: {
        id: '',
        name: ''
      },
      city: {
        id: '',
        name: ''
      },
      county: {
        id: '',
        name: ''
      },
      store: {
        id: '',
        name: ''
      }
    };
  },
  componentWillUnmount() {
    this._submitData();
  },
  createButton(type, id, text) {
    return (
      <a key={id}
        onClick={this._select.bind(this, type, id, text)}>
        {text}
      </a>
    );
  },
  _select(type, id, name) {
    const temp = {
      id: id,
      name: name
    };
    switch (type) {
      case 'areas' :
        this.setState({
          area: temp
        });
        ControlActions.geoAreaChange(temp);
        break;
      case 'provinces' :
        this.setState({
          province: temp
        });
        ControlActions.geoProvinceChange(temp);
        break;
      case 'citys' :
        this.setState({
          city: temp
        });
        ControlActions.geoCityChange(temp);
        break;
      case 'countys' :
        this.setState({
          county: temp
        });
        ControlActions.geoCountyChange(temp);
        break;
      case 'stores' :
        this.setState({
          store: temp
        });
        ControlActions.geoStoreChange(temp);
        break;
      default :
        break;
    }
    this._submitData(type, id, name);
  },
  _submitData(type, id, name) {
    this.props.onGeoAdded(type, id, name);
  },
  buildButtons(type) {
    if (this.state.geoData[type] === undefined) {
      return ['没有数据'];
    }
    const result = [];
    for (const obj of this.state.geoData[type]) {
      result.push(this.createButton(type, obj.id, obj.name));
    }
    return result;
  },
  buildRegionButtons() {
    return this.buildButtons('areas');
  },
  buildProvinceButtons() {
    return this.buildButtons('provinces');
  },
  buildCityButtons() {
    return this.buildButtons('citys');
  },
  buildCountyButtons() {
    return this.buildButtons('countys');
  },
  buildStoreButtons() {
    return this.buildButtons('stores');
  },
  render() {
    const regionButtons = this.buildRegionButtons();
    const provinceButtons = this.buildProvinceButtons();
    const cityButtons = this.buildCityButtons();
    const countyButtons = this.buildCountyButtons();
    // let storeButtons = this.buildStoreButtons();

    const wrapInCol = (inside, index)=>(
        <div className="item" key={index}>
          {inside}
        </div>
    );

    return (
      <div className={this.props.className} style={this.props.style}>
        <div className="geo-popover">
          <div className="row">
            <div className="label">国家</div>
            <div className="fix-width">
              <div className="item">中国</div>
            </div>
          </div>
          <div className="row">
            <div className="label">大区</div>
            <div className="fix-width">
              {regionButtons.map(wrapInCol)}
            </div>
          </div>
          <div className="row">
            <div className="label">省份</div>
            <div className="fix-width">
            {provinceButtons.map(wrapInCol)}
            </div>
          </div>
          <div className="row">
            <div className="label">城市</div>
            <div className="fix-width">
            {cityButtons.map(wrapInCol)}
            </div>
          </div>
          <div className="row">
            <div className="label">区/县</div>
            <div className="fix-width">
            {countyButtons.map(wrapInCol)}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
// Removed this from geo pop over
// <div className="row">
//   <div className="label">店铺</div>
//   <div className="fix-width">
//   {storeButtons.map(wrapInCol)}
//   </div>
// </div>

const GeoSelector = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },
  getInitialState() {
    return {
      displayText_province: '未选择',
      displayText_city: '未选择',
      displayText_county: '未选择',
      selected: {},
      isOpen: false
    };
  },
  _togglePopOver() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  },
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  },
  handleDocumentClick(event) {
    if (!React.findDOMNode(this).contains(event.target)) {
      this.setState({
        isOpen: false
      });
    }
  },
  _onGeoAdded(type, id, name) {
    const newState = {
      isOpen: false
    };
    switch (type) {
      case 'areas' :
        newState.displayText_province = '未选择';
        newState.displayText_city = '未选择';
        newState.displayText_county = '未选择';
        break;
      case 'provinces' :
        newState.displayText_province = name;
        break;
      case 'citys' :
        newState.displayText_city = name;
        break;
      case 'countys' :
        newState.displayText_county = name;
        break;
      case 'stores' :
        break;
      default :
        break;
    }
    this.setState(newState);
  },
  render() {
    return (
      <div id="geo-selector" className={this.props.className}>
        <div className="ui button" onClick={this._togglePopOver}>
          <div className="ui breadcrumb">
            <div className="section">{this.state.displayText_province}</div>
            /
            <div className="section">{this.state.displayText_city}</div>
            /
            <div className="section">{this.state.displayText_county}</div>
          </div>
        </div>
        { this.state.isOpen ?
          <GeoPopOver className="ui geo visible bottom left popup" onGeoAdded={this._onGeoAdded}/> :
          null
        }
      </div>
    );
  }
});

export {GeoSelector, GeoPopOver};
