import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable } from '@fortawesome/free-solid-svg-icons'


function Title() {
  const style = {
    'padding-left': '30px',
    'background-color': '#fff',
    'box-shadow': '1px 1px 5px rgb(199, 199, 199)',
    width: '100%',
    height: '3.5rem',
    'font-size': '1.1rem',
    'font-weight': '200',
    color: 'rgb(0, 0, 0)',

    display: 'flex',
    'justify-content': 'flex-start',
    'align-items': 'center',
    'flex-direction': 'row',
  }

  return (
    <div className="Home-title" style={style}>
      <FontAwesomeIcon style={{"color": "#777" ,"transform": "transitionY(1px)"}} icon={faTable} />
      <span style={{"cursor": "default","padding-left": "8px"}}>Table Maker</span>
    </div>
  )
}

export default Title
