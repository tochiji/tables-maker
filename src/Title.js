import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable } from '@fortawesome/free-solid-svg-icons'


function Title() {
  const style = {
    paddingTop: '4px',
    paddingLeft: '30px',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 5px rgb(199, 199, 199)',
    width: '100%',
    height: '3.5rem',
    fontSize: '1.1rem',
    fontWeight: '200',
    color: '#444',

    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  }

  return (
    <div className="Home-title" style={style}>
      <FontAwesomeIcon style={{transform: "transitionY(1px)"}} icon={faTable} />
      <span style={{fontWeight: 600, cursor: "default",paddingLeft: "8px"}}>Table Maker</span>
    </div>
  )
}

export default Title
