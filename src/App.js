import React, { useState } from 'react'
import shortid from 'shortid'
import './App.scss'
import { items } from './definition'
import { save, load } from './save'
import { CellBool, CellTypeSelect ,CellText } from './cells'


function Cell(prop) {
  if (prop.type === 'bool') {
    return <CellBool {...prop} />
  } else if (prop.type === 'type-select') {
    return <CellTypeSelect {...prop} />
  } else {
    return <CellText {...prop} />
  }
}

function Row(prop) {
  const del = () => {
    const table = prop.table.slice()
    const newtable = table.filter(r =>{
      return r.id !== prop.rowid
    })
    prop.setTable(newtable)
  }
  const r = prop.row.data
  return (
    <tr>
      <td>{prop.rowNo}</td>
      {items.map((item, i) => (
        <Cell key={item.id} rowid={prop.rowid} itemid={item.id} type={item.type} content={r[item.id]} {...prop} />
      ))}
      <td className="del" onClick={del}>del</td>
    </tr>
  )
}

function Rows(prop) {
  return (
    <tbody>
      {prop.table.map((r, i) => (
        <Row key={r.id} rowid={r.id} rowNo={i+1} row={r} {...prop} />
      ))}
    </tbody>
  )
}

function Header(prop) {
  return (
    <thead>
      <tr>
        <th>No</th>
        {items.map(v => (
          <th key={v.id}>{v.name}</th>
        ))}
        <th className="del" />
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
        <td colSpan={items.length + 1} onClick={addRow}>
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
      <Info table={table} />
    </div>
  )
}

function Info(prop) {
  const PKcount = prop.table.filter(v => {
    return v.data.ispk
  }).length
  return (
    <div>
      <div>{prop.table.length + '行あるよ'}</div>
      <div>{'PKは' + PKcount + '個あるよ'}</div>
    </div>
  )
}

export default App
