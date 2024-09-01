import React from 'react'
import './OptionsMenu.css'
import { Link } from 'react-router-dom'

export default function ImageEditorNavbar(props) {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar";

  return (
    <div>
      {props.isOpen &&  
        <div className={`${sidebarClass} left-nav-bar`}>
          {props.optionList && Object.keys(props.optionList).map((key) => {
            return (
              <ul>
                <li><Link className='p-2' role='button' onClick={() => {props.changeCompStr(props.optionList[key]); props.toggleNav();}}>{key}</Link></li>
              </ul>
            )
          })}
      </div>}
    </div>
  )
}
