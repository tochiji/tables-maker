import React from 'react'
import Title from './Title'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const spinStyle = { marginTop: '20px', color: '#4a4a4a' }

const LoadingIcon = () => (
  <div style={spinStyle}>
    <FontAwesomeIcon icon={faSpinner} size="2x" spin />
  </div>
)

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: '100%',
  fontWeight: '600'
}

const Loading = () => (
  <div style={style}>
    <Title />
    <LoadingIcon />
  </div>
)

export default Loading
