  
'use strict';

var React = require('react');
var _ = require('lodash');
var c3 = require('c3');
var d3 = require('d3');

var C3Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    options: React.PropTypes.shape({
      padding: React.PropTypes.shape({
        top: React.PropTypes.number,
        bottom: React.PropTypes.number,
        left: React.PropTypes.number,
        right: React.PropTypes.number
      }),
      size: React.PropTypes.shape({
        width: React.PropTypes.number,
        height: React.PropTypes.number
      }),
      labels: React.PropTypes.bool,
      onclick: React.PropTypes.func,
      axisLabel: React.PropTypes.shape({
        // x: React.PropTypes.string
        y: React.PropTypes.string
      }),
      subchart: React.PropTypes.bool,
      zoom: React.PropTypes.bool,
      grid: React.PropTypes.shape({
        x: React.PropTypes.bool,
        y: React.PropTypes.bool
      })
    })
  },
  colors (count) {
    let colors = [];
    let color = d3.scale.category10();
    for (var i = 0; i < count; i++) {
      colors.push(color(i));
    }
    return colors;
  },
  graphObject () {
    var graphObject = {
      data: {},
      axis: {},
      bindto: "#" + this.props.tagId,
    };
    var options = this.props.options;
    // Add colors
    if(this.props.data.colors == undefined){
      graphObject.color = {
        pattern: this.colors(20)
      };
    }
    // Add padding
    if (options.padding) {
      graphObject.padding = {
        top: options.padding.top,
        left: options.padding.left,
        right: options.padding.right,
        bottom: options.padding.bottom
      };
    }
    // Add size
    if (options.size) {
      graphObject.size = {
        width: options.size.width,
        height: options.size.height
      };
    }
    // Add lables
    if (options.labels) {
      graphObject.data.labels = options.labels;
    }
    if (options.onClick) {
      graphObject.data.onclick = options.onClick;
    }
    if (options.axisLabel) {
      if (typeof(options.axisLabel.x) == 'object') {
        graphObject.axis.x = options.axisLabel.x;
      } else {
        graphObject.axis.x = {
          label: options.axisLabel.x
        };
      }
      if (typeof(options.axisLabel.y) == 'object') {
        graphObject.axix.y = options.axisLabel.y;
      } else {
        graphObject.axis.y = {
          label: options.axisLabel.y
        };
      }
      if (options.axisLabel.y2) {
        graphObject.axis.y2 = {
          label: options.axisLabel.y2,
          show: true
        };
      }
    }
    if (options.subchart) {
      graphObject.subchart = {
        show: options.subchart
      };
    }
    if (options.zoom) {
      graphObject.zoom = {
        enabled: options.zoom
      };
    }
    if (options.grid) {
      graphObject.grid = {
        x: {
          show: options.grid.x
        },
        y: {
          show: options.grid.y
        }
      };
    }
    // Add tooltip
    if (options.tooltip) {
      graphObject.tooltip = options.tooltip;
    }
    // Add point size
    if (options.point) {
      graphObject.point = options.point
    }

    return graphObject;
  },
  drawGraph () {
    var graphObj = this.graphObject();
    graphObj.data = _.merge(this.props.data, graphObj.data);
    // console.log(graphObj);
    var chart = c3.generate(graphObj);
    return chart;
  },
  componentDidMount () {
    this.drawGraph();
  },
  componentWillUnmount () {},
  componentDidUpdate (prevProps, prevState) {
    this.drawGraph();
  },
  render () {
    return (
      <div id={this.props.tagId}></div>
    );
  }
});

export default C3Chart;
