import React from 'react'
import { columnTypes } from './definition' 

function cleanPaste(e) {
  e.preventDefault()
  var text = (e.originalEvent || e).clipboardData.getData('text/plain')
  document.execCommand('insertHTML', false, text)
}

function updateCell(props, e, targetProperty) {
  const columns = props.columns.slice()
  const newColumns = columns.map(v => {
    if (v.id === props.rowid) {
      v.data[props.itemid] = e.target[targetProperty]
    }
    return v
  })
  props.setColumns(newColumns)
}

function Cell(props) {
  if (props.type === 'bool') {
    return <CellBool {...props} />
  } else if (props.type === 'type-select') {
    return <CellTypeSelect {...props} />
  } else if (props.type === 'textarea') {
    return <CellTextArea {...props} />
  } else {
    return <CellText {...props} />
  }
}

function CellBool(props) {
  const targetProperty = 'checked'

  return (
    <td style={props.style}>
      <input type="checkbox" checked={props.content || false} onChange={e => updateCell(props, e, targetProperty)} />
    </td>
  )
}

function CellTypeSelect(props) {
  const targetProperty = 'value'

  return (
    <td className="select" style={props.style}>
      <select name="column-type" value={props.content} onChange={e => updateCell(props, e, targetProperty)}>
        {columnTypes.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </td>
  )
}

function CellTextArea(props) {
  const targetProperty = 'innerHTML'

  return (
    <td
      suppressContentEditableWarning={true}
      contentEditable={true}
      dangerouslySetInnerHTML={{
        __html: props.content,
      }}
      onPaste={cleanPaste}
      onBlur={e => updateCell(props, e, targetProperty)}
      style={{"textAlign": "left", "padding": "3px", ...props.style}}
    />
  )
}


function CellText(props) {
  const targetProperty = 'innerHTML'

  return (
    <td
      suppressContentEditableWarning={true}
      contentEditable={true}
      dangerouslySetInnerHTML={{
        __html: props.content,
      }}
      onPaste={cleanPaste}
      onBlur={e => updateCell(props, e, targetProperty)}
      style={props.style}
    />
  )
}

export { Cell }
