import React from 'react';

const Indicator = React.createClass({
  getInitialState () {
    let initState = {
      color: 'rgb(198, 198, 0)',
      class: 'minus icon'
    }
    return initState;
  },
  componentDidMount () {
    if (this.props.data == 0 || this.props.data == undefined) {
      return;
    } else if (this.props.data < 0) {
      this.setState({
        color: 'rgb(222, 73, 33)',
        class: 'caret down icon'
      });
    } else {
      this.setState({
        color: 'rgb(92, 191, 4)',
        class: 'caret up icon'
      });
    }
  },
  render () {
    let displayVal = Math.abs(this.props.data * 100).toFixed(1);
    return (
      <div style={{display:(this.props.data !== undefined) ? 'inline-block' : 'none', color:this.state.color}}>
        <i className={this.state.class} style={{paddingRight:'3px'}}></i>
          {displayVal}%
      </div>
    );
  }
});

const BodyItem = React.createClass({
  buildTableHead () {
    return (
      <thead className="full-width">
        <tr>
          <th className="center aligned" colSpan="2">{this.props.w.title}</th>
        </tr>
      </thead>
    )
  },
  buildTableBody () {
    let result = [] // The basic layout for body is two rows,
    // First one for mainData
    // Second row displays secondaryData

    for (let i = 0, l = this.props.w.dataset.length; i < l; i++) {
      let elem = this.props.w.dataset[i];
      // Every dataset takes one line (row/<tr>)
      let main,
        secondary;
      if (elem.mainData !== undefined) {
        // Has main data
        main = (
            <div className="main">
              <h5>
                {elem.mainData.number}
                  {elem.mainData.unit}
              </h5>
              <Indicator data={elem.mainData.indicator}/>
            </div>
        )
      }
      // This checks if we should add secondary
      if (elem.secondaryData && elem.secondaryData.number && elem.secondaryData.unit) {
        secondary = (
            <div className="secondary">
              {elem.secondaryData.number}
                {elem.secondaryData.unit}
            </div>
        )
      }

      let toBePushed = (
          <tr className="item-row" key={i}>
            <td>
              {main}
                {secondary}
            </td>
          </tr>
      )
      result.push(toBePushed);
    }
    return (
      <tbody>
        {result}
      </tbody>
    );
  },
  render () {
    return (
      <div className="item">
        <table className="ui basic padded table">
          {this.buildTableHead()}
            {this.buildTableBody()}
        </table>
      </div>
    )
  }
});

/**
* StandardBody - takes in one prop named data
* the structure of data should be like this:
* {
*   graph : ... (either empty or a GRAPH component),
*   d1 : {
*     title: '' (a string),
*     dataset:[] (A list of data, must contain mainData, may contain secondaryData)
*   },
*   d2... (repeating d1)
* }
*/
const StandardBody = React.createClass({
  createContent () {
    let items = [];
    if (!this.props.data) {
      // data is undefined
      items.push(<div className="empty-view">
        This is an empty body
      </div>)
      return items;
    }
    // data is defined
    for (let k in this.props.data) {
      if (k == 'graph') {
        // Ignore graph since it's already included in createLayout
        continue;
      }
      items.push(<div className="column" key={k}>
        <BodyItem w={this.props.data[k]}/>
      </div>);
    }
    return items;
  },
  createLayout () {
    let content = this.createContent();
    // Check if there's graph
    if (this.props.data.graph) {
      // if graph is defiend, first layout should be like 10-6
      return (
        <div className="ui padded grid container stackable" style={{
                            marginLeft: '0 !important', marginRight :'0 !important'
                          }}>
          <div className="ten wide column">
            <div className="ui padded grid container equal width stackable">
              {content}
            </div>
          </div>
          <div className="six wide column">
            {this.props.data.graph}
          </div>
        </div>
      )
    } else {
      // No graph, use 5 columns
      return (
        <div className="ui padded grid container equal width stackable" style={{
                            marginLeft: '0 !important', marginRight :'0 !important'
                          }}>
          {content}
        </div>
      )
    }
  },
  render () {
    let layout = this.createLayout();
    return layout
  }
});

export default StandardBody;
