import React from 'react'
import { NavLink } from 'react-router-dom'

const Menu = () => (
  <div className={`topnav`}>
    <ul style={{ userSelect: 'none' }}>
      <li className="link">
        <NavLink className="text_link" exact activeClassName="active" to="/">Home</NavLink>
      </li>
      <li className="link">
        <NavLink className="text_link" activeClassName="active" to="/airlines">Airlines</NavLink>
      </li>
      <li className="link">
        <a className="text_link" href="https://github.com/httpJunkie/rage-with-couchbase">
          Source Code
      </a>
      </li>
    </ul>
  </div>
)

export default Menu