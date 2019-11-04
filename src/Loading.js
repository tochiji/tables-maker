import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const style = { marginTop: '20px', color: "#4a4a4a" }

const Loading = () => (
  <div style={style}>
    <FontAwesomeIcon icon={faSpinner} size="2x" spin />
  </div>
)

export default Loading
