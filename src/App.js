import React, { useState } from 'react'
import shortid from 'shortid'
import './App.scss'
import { items } from './definition'

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
    const newtable = table.map(v => {
      if (v.id === rowid || node === 'TD') {
        v.data[itemid] = e.target.innerHTML
        return v
      } else if (v.id === rowid || node === 'INPUT') {
        v.data[itemid] = e.target.value
        return v
      } else {
        return v
      }
    })
    setTable(newtable)
  }

  if (type === 'bool') {
    return (
      <td>
        <input type="checkbox" value={prop.content || false} onChange={e => updateCell(e)} />
      </td>
    )
  } else {
    return (
      <td contentEditable={true} onPaste={cleanPaste} onBlur={e => updateCell(e)}>
        {prop.content}
      </td>
    )
  }
}

function Row(prop) {
  const r = prop.data
  return (
    <tr>
      {items.map((item, i) => (
        <Cell
          key={item.id}
          rowid={prop.rowid}
          itemid={item.id}
          type={item.type}
          content={r[item.id] || null}
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
        <Row key={r.id} rowid={r.id} data={r} {...prop} />
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
  const [table, setTable] = useState([])
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
