import React from "react";
import { Link } from "react-router-dom";

function NoMatch ({ location }) {
  return (
    <div style={{padding: '1em', textAlign: 'center'}}>
      path: <code>{location.pathname}</code> not found, <Link className='menu' to={`/`}> back to home?</Link><br />
    </div>
  )
};

export default NoMatch;
