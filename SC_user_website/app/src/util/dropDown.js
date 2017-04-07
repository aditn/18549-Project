import React from 'react';
import classNames from 'classnames';

const Dropdown = React.createClass({
  propTypes: {
    options: React.PropTypes.oneOfType([
      React.PropTypes.array, React.PropTypes.object
    ]).isRequired,
    defaultOption: React.PropTypes.shape({
      label: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired,
    fixedLabel: React.PropTypes.string
  },
  getInitialState() {
    return {
      selected: this.props.defaultOption,
      isOpen: false
    };
  },
  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false);
  },
  componentWillReceiveProps(newProps) {
    // console.log(newProps);
    if (newProps.defaultOption && newProps.defaultOption.name !== this.state.selected.name) {
      this.setState({
        selected: newProps.defaultOption
      });
    }
  },
  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  },
  setValue(option) {
    // console.log('Clicked, setting value');
    const newState = {
      selected: option,
      isOpen: false
    };
    this.fireChangeEvent(newState);
    this.setState(newState);
  },
  fireChangeEvent(newState) {
    // console.log(newState);
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  },
  buildMenu() {
    // console.log('Building menu');
    const ops = [];
    for (const option in this.props.options) {
      if (this.props.options.hasOwnProperty(option)) {
        const toBePushed = this.renderOption(this.props.options[option]);
        ops.push(toBePushed);
      }
    }
    return ops.length ? ops : <div className="input">No opitons found</div>;
  },
  handleDocumentClick(event) {
    if (!React.findDOMNode(this).contains(event.target)) {
      this.setState({
        isOpen: false
      });
    }
  },
  handleMouseDown(event) {
    if (event.type === 'mousedown' && event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen
    });
  },
  renderOption(option) {
    // console.log('Rendering option');
    const optionClass = classNames({
      'item': true,
      'active': option.label === this.state.selected.label,
      'selected': option.label === this.state.selected.label
    });
    return (
    <div className={optionClass}
      key={option.name}
      onClick={this.setValue.bind(this, option)}
      onMouseDown={this.setValue.bind(this, option)}>
      {option.label}
    </div>);
  },
  render() {
    // console.log('rendering');
    // console.log(this.state);

    const outerClasses = classNames('ui selection dropdown fluid visible', {
      'active': this.state.isOpen
    });

    const innerClasses = classNames('menu', 'transition', {
      'hidden': !this.state.isOpen,
      'active': this.state.isOpen
    });
    const myFixedLabelStyle = {
      position: 'absolute',
      backgroundColor: 'white',
      top: '-0.1rem',
      borderTop: '1px solid rgba(34,36,38,.35)',
      zIndex: -1
    };
    const items = this.buildMenu();
    return (
      <div
        className={outerClasses}
        onMouseDown={this.handleMouseDown}
        onTouchEnd={this.handleMouseDown}>
        <i className="dropdown icon"></i>
        <div className="default text">
          <h5 style={myFixedLabelStyle}>{this.props.fixedLabel}</h5>
          {this.state.selected.label}
        </div>
        <div className={innerClasses} style={{display: 'block'}}>
          {items}
        </div>
      </div>
    );
  }
});

export default Dropdown;
