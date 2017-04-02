import React from 'react';
import { Link } from 'react-router';

const ProjectCard = React.createClass({
  propTypes: {
    prj: React.PropTypes.object,
    idx: React.PropTypes.number,
    occupiedStores: React.PropTypes.array
  },
  findOwnedStores() {
    let count = 0;
    for (const st of this.props.occupiedStores) {
      if (st.id === this.props.prj.id) {
        count ++;
      }
    }
    return count;
  },
  render() {
    const { idx, prj } = this.props;
    return (
      <Link key={idx} className="project" to={`/setting/project-management/${prj.id}`}>
        <section className="cover"></section>
        <section className="wrapper">
          <span className="title"> {prj.desc} </span>
          <span className="detail"> 商铺数量 : {this.findOwnedStores()} </span>
        </section>
      </Link>
    );
  }
});

export default ProjectCard;
