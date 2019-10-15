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

function CellBool(props) {
  const targetProperty = 'checked'

  return (
    <td>
      <input type="checkbox" checked={props.content || false} onChange={e => updateCell(props, e, targetProperty)} />
    </td>
  )
}

function CellTypeSelect(prop) {
  const targetProperty = 'value'

  return (
    <td className="select">
      <select name="column-type" value={prop.content} onChange={e => updateCell(prop, e, targetProperty)}>
        {columnTypes.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    </td>
  )
}

function CellText(prop) {
  const targetProperty = 'innerHTML'

  return (
    <td
      suppressContentEditableWarning={true}
      contentEditable={true}
      dangerouslySetInnerHTML={{
        __html: prop.content,
      }}
      onPaste={cleanPaste}
      onBlur={e => updateCell(prop, e, targetProperty)}
    />
  )
}

export { CellBool, CellTypeSelect, CellText }
