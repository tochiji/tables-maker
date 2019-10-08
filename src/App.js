import React, { useState } from 'react'
import shortid from 'shortid'
import './App.scss'
import { items } from './definition'
import { save, load } from './save'

function cleanPaste(e) {
  e.preventDefault()
  var text = (e.originalEvent || e).clipboardData.getData('text/plain')
  document.execCommand('insertHTML', false, text)
}

function Cell(prop) {
  const type = prop.type
  const itemid = prop.itemid
  const rowid = prop.rowid
  const table = prop.table.slice()
  const setTable = prop.setTable

  const updateCell = e => {
    const node = e.target.nodeName
    const type = e.target.type
    const newtable = table.map(v => {
      if (v.id === rowid && node === 'TD') {
        v.data[itemid] = e.target.innerHTML
      } else if (v.id === rowid && type === 'checkbox') {
        v.data[itemid] = e.target.checked
      }
      return v
    })
    setTable(newtable)
    save(newtable)
  }

  if (type === 'bool') {
    return (
      <td>
        <input type="checkbox" checked={prop.content || false} onChange={e => updateCell(e)} />
      </td>
    )
  } else {
    return (
      <td suppressContentEditableWarning={true} contentEditable={true} onPaste={cleanPaste} onBlur={e => updateCell(e)}>
        {prop.content}
      </td>
    )
  }
}

function Row(prop) {
  const r = prop.row.data
  return (
    <tr>
      {items.map((item, i) => (
        <Cell
          key={item.id}
          rowid={prop.rowid}
          itemid={item.id}
          type={item.type}
          content={r[item.id]}
          {...prop}
        />
      ))}
    </tr>
  )
}

function Rows(prop) {
  return (
    <tbody>
      {prop.table.map(r => (
        <Row key={r.id} rowid={r.id} row={r} {...prop} />
      ))}
    </tbody>
  )
}

function Header(prop) {
  return (
    <thead>
      <tr>
        {items.map(v => (
          <th key={v.id}>{v.name}</th>
        ))}
      </tr>
    </thead>
  )
}

function NewLineAdd(prop) {
  const addRow = () => {
    const r = prop.table.slice()
    r.push({ id: shortid.generate(), data: {} })
    prop.setTable(r)
    console.log(r)
    save(r)
  }

  return (
    <tfoot className="App-addrow">
      <tr>
        <td colSpan={items.length} onClick={addRow}>
          ここをクリックしてね
        </td>
      </tr>
    </tfoot>
  )
}

function App() {
  const saved = load() || []
  const [table, setTable] = useState(saved)
  const prop = {
    table: table,
    setTable: setTable,
  }

  return (
    <div className="App">
      <div className="App-title">テーブル設計サイト</div>
      <table className="App-table">
        <Header />
        <Rows {...prop} />
        <NewLineAdd {...prop} />
      </table>
    </div>
  )
}

export default App
