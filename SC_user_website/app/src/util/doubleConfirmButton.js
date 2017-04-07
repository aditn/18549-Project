import React from 'react';


const ConfirmButton = React.createClass({
  proptypes:{
    initialText : React.PropTypes.any.isRequired,
    intermediateText : React.PropTypes.any.isRequired,
    intermediateClass : React.PropTypes.string,
    confirmedFunc : React.PropTypes.func.isRequired
  },
  getInitialState(){
    return{
      showIntermediate : false
    }
  },
  componentDidMount () {
    document.addEventListener("click", this.handleDocumentClick, false);
  },
  componentWillUnmount () {
    document.removeEventListener("click", this.handleDocumentClick, false);
  },
  handleDocumentClick (event) {

    if (!React.findDOMNode(this).contains(event.target)) {
      this.setState({
        showIntermediate: false
      });
    }
  },
  onClick(){
    if(this.state.showIntermediate){
      this.props.confirmedFunc();
      this.setState({
        showIntermediate: false
      });
    }else{
      //Not confirmed, make confirm
      this.setState({
        showIntermediate : true
      })
    }
  },
  render(){
    return (
      <button className={
          this.state.showIntermediate?this.props.intermediateClass : this.props.className}
          onClick={this.onClick}>

        {this.state.showIntermediate ?
          this.props.intermediateText : this.props.initialText}
      </button>
    )
  }
});

export default ConfirmButton;
