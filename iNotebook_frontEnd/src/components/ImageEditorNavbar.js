import React, { useState } from 'react'
import './ImageEditorNavbar.css'
import { Link } from 'react-router-dom'

export default function ImageEditorNavbar(props) {
  const sidebarClass = props.isOpen ? "sidebar open" : "sidebar"
  return (
    <div>
      {props.isOpen &&  
        <div className={`${sidebarClass} left-nav-bar`}>
          <ul>
            <li><Link className='p-2' role='button' onClick={() => {props.changeCompStr('roundcorners'); props.toggleNav();}}>Round Corners</Link></li>
            <li><Link className='p-2' role='button' onClick={() => {props.changeCompStr('enhance'); props.toggleNav();}}>Enhance image</Link></li>
          </ul>
      </div>}
    </div>
  )
}
