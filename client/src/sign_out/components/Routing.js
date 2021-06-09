import React, { memo } from "react";
import PropTypes from "prop-types";
import { Switch } from "react-router-dom";
import Home from "../components/home/Home"
import PropsRoute from "../../shared/components/PropsRoute";

function Routing(props) {
  const { selectHome } = props;
  return (
    <Switch>
      <PropsRoute path="/" component={Home} selectHome={selectHome} />
    </Switch>
  );
}

Routing.propTypes = {
  blogposts: PropTypes.arrayOf(PropTypes.object),
  selectHome: PropTypes.func.isRequired,
  selectBlog: PropTypes.func.isRequired,
};

export default memo(Routing);
