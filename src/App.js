import React, { useState } from 'react'
import shortid from 'shortid'
import './App.scss'
import { items } from './definition'

function cleanPaste(e) {
  e.preventDefault()
  var text = (e.originalEvent || e).clipboardData.getData('text/plain')
  document.execCommand('insertHTML', false, text)
}

function updateCell(updatef, rowid, e) {
  
}

function Cell(prop) {
  // const [isInput,setIsInput] = useState(false);
  const type = prop.type
  const setRow = prop.setRow

  if (type === 'bool') {
    return (
      <td>
        <input type="checkbox" value={prop.content} />
      </td>
    )
  } else {
    return (
      <td contentEditable={true} onPaste={cleanPaste} onBlur={e => updateCell(setRow, prop.rowid,e)}>
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
        <Cell key={item.id} rowid={prop.rowid} type={item.type} content={r[item.id] || null} setRow={prop.setRow} />
      ))}
    </tr>
  )
}

function Rows(prop) {
  return (
    <>
      {prop.row.map(r => (
        <Row key={r.id} rowid={r.id} data={r} setRow={prop.setRow} />
      ))}
    </>
  )
}

function Header(prop) {
  return (
    <tr>
      {items.map(v => (
        <th key={v.id}>{v.name}</th>
      ))}
    </tr>
  )
}

function NewLineAdd(prop) {
  return (
    <tr className="App-addrow">
      <td
        colSpan={items.length}
        onClick={() => {
          const r = prop.row.slice()
          r.push({ id: shortid.generate() })
          prop.setRow(r)
        }}
      >
        ここをクリックしてね
      </td>
    </tr>
  )
}

function App() {
  const [row, setRow] = useState([])

  return (
    <div className="App">
      <div className="App-title">テーブル設計サイト</div>
      <table className="App-table">
        <Header />
        <Rows row={row} setRow={setRow} />
        <NewLineAdd row={row} setRow={setRow} />
      </table>
    </div>
  )
}

export default App
