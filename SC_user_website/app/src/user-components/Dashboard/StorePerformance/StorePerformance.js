import React from 'react';
import Reflux from 'reflux';
// Load constants
import _CONST from '../../../constants/RedKnifeConstants';
// ControlActions
import ControlActions from '../../../reflux-actions/controlActions.js';
import SPDataStore from './spDataStore.js';
// Loader
import Loader from '../../../util/loader';
// My widgets
import CustomerFlowWidget from './customerFlowWidget';
import CustomerQualityWidget from './customerQualityWidget';
import CustomerConversionWidget from './customerConversionWidget';

const StorePerformance = React.createClass({
  mixins: [Reflux.connect(SPDataStore, 'mega')],
  render() {
    // console.log(this.state);
    return (
      <div>
        <div className="ui padded grid">
          <div className="row">
            {this.state.mega.cfwidget.isLoading ? <Loader/> : <CustomerFlowWidget mega={this.state.mega.cfwidget.data}/>}
          </div>
          <div className="row">
            {this.state.mega.cqwidget.isLoading ? <Loader/> :
            <CustomerQualityWidget mega={this.state.mega.cqwidget.data}/>}
          </div>
          <div className="row">
            {(this.state.mega.ccwidget.isLoadingUd || this.state.mega.ccwidget.isLoadingDw) ? <Loader/> :
            <CustomerConversionWidget mega={this.state.mega.ccwidget.data.ud.general} pMega={this.state.mega.ccwidget.data.ud.previous}
            additional={this.state.mega.ccwidget.data.additional}/>}
          </div>
        </div>
      </div>
    )
  }
});

export default StorePerformance;
