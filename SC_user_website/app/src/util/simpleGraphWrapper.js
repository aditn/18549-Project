import React from 'react';
// Graphs
import C3Chart from './c3Chart';

const SimpleGraphWrapper = React.createClass({
  getChart () {
    if (this.props.body == undefined || this.props.body == null) {
      return (
        <div className="empty">Opps, Nothing here</div>
      )
    }
    let inner;

    let graphData = this.props.body.data;
    var graphOptions = this.props.body.options;
    
    if(graphData == undefined || graphData.columns == undefined || graphData.columns.length <= 0){
      // no data
      return(
        <div className="empty">There's no data!</div>
      )
    }
    switch (this.props.type) {
    case 'lineBar':
    case 'scatter':
    case 'bar':
    case 'pie':
    case 'line':
      inner = <C3Chart data={graphData} options={graphOptions} tagId={this.props.tagId}/>
      break;
    default:
      inner = (
          <div className="empty">This widget failed to render</div>
      )
    }
    return inner;
  },
  getInitialState () {
    return {};
  },
  render () {
    let inside = this.getChart();
    return (
      <div className="wrapper-container">
        <div className="header wb clearfix">
          <label>{this.props.head.name}
            <div className="showWhenHover">
              <i className="help icon"/>
              <span>
                {this.props.head.desc}
              </span>
            </div>
          </label>
          <div className="legend">
            {this.props.head.legend}
          </div>
        </div>
        <div className="body wb">
          {inside}
        </div>
      </div>
    );
  }
});

export default SimpleGraphWrapper;
