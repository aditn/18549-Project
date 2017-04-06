import React from 'react';
import { Link } from 'react-router';

// This container takes in stores as parameter and displays them
const StoresContainer = React.createClass({
  PropTypes:{
    stores : React.PropTypes.array.required
  },
  render(){
    const allStores = this.props.stores.map((store,index)=>(
      <Link className="store" key={index}
         to={`/setting/store-management/${store.id}`}>
        <section className={"cover" + (store.project ? " online" : "")}/>
        <section className="wrapper">
          <span className="title">{store.name}</span>
          <span className="detail">{store.code}</span>
        </section>
      </Link>
    ));
    return (
      <div className={this.props.className}>
        {allStores}
      </div>
    );
  }
});

export default StoresContainer;
