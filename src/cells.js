import React from 'react'
import { columnTypes } from './definition'
import { save } from './save'

function cleanPaste(e) {
  e.preventDefault()
  var text = (e.originalEvent || e).clipboardData.getData('text/plain')
  document.execCommand('insertHTML', false, text)
}

function updateCell(prop, e, targetProperty) {
  const table = prop.table.slice()
  const newtable = table.map(v => {
    if (v.id === prop.rowid) {
      v.data[prop.itemid] = e.target[targetProperty]
    }
    return v
  })
  prop.setTable(newtable)
  save(newtable)
}


function CellBool(prop) {
  const targetProperty = 'checked'

  return (
    <td>
      <input type="checkbox" checked={prop.content || false} onChange={e => updateCell(prop, e, targetProperty)} />
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
