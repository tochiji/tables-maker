import React, { useState, useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import shortid from 'shortid'
import './App.scss'
import { items } from './definition'
import { save, load } from './save'
import DnDTypes from './DnDTypes'
import { CellBool, CellTypeSelect, CellText } from './cells'

function App() {
  const saved = load() || []
  const [table, setTable] = useState(saved)
  const prop = {
    table: table,
    setTable: setTable,
  }

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <div className="App-title">テーブル設計サイト</div>
        <table className="App-table">
          <Header />
          <Rows {...prop} />
          <NewLineAdd {...prop} />
        </table>
        <Info table={table} />
      </DndProvider>
    </div>
  )
}

function Header(prop) {
  const style = { backgroundColor: '#666', color: '#fff' }
  return (
    <thead>
      <tr >
        <th style={style}>No</th>
        {items.map(v => (
          <th key={v.id} style={style}>{v.name}</th>
        ))}
        <th className="del" style={{ backgroundColor: 'transparent' }} />
      </tr>
    </thead>
  )
}

function Rows(prop) {
  const table = prop.table

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = table[dragIndex]
      const hoverRow = table[hoverIndex]
      const newTable = table.slice()
      newTable[hoverIndex] = dragRow
      newTable[dragIndex] = hoverRow
      prop.setTable(newTable)
      save(newTable)
    },
    [prop, table]
  )

  return (
    <tbody>
      {prop.table.map((r, i) => (
        <Row key={r.id} rowid={r.id} rowNo={i} row={r} moveRow={moveRow} {...prop} />
      ))}
    </tbody>
  )
}

function Row(prop) {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: DnDTypes.ROW,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      console.log(ref)
      const dragIndex = item.rowNo
      const hoverIndex = prop.rowNo
      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      prop.moveRow(dragIndex, hoverIndex)
      item.rowNo = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: DnDTypes.ROW, rowid: prop.rowid, rowNo: prop.rowNo },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drag(drop(ref))

  const del = () => {
    const table = prop.table.slice()
    const newtable = table.filter(r => {
      return r.id !== prop.rowid
    })
    prop.setTable(newtable)
  }
  const r = prop.row.data
  return (
    <tr ref={ref} style={{ backgroundColor: isDragging ? '#eee' : '#fff' }}>
      <td>{prop.rowNo + 1}</td>
      {items.map((item, i) => (
        <Cell key={item.id} rowid={prop.rowid} itemid={item.id} type={item.type} content={r[item.id]} {...prop} />
      ))}
      <td className="del" onClick={del} style={{ visibility: isDragging ? "hidden" : "display" }}>
        del
      </td>
    </tr>
  )
}

function Cell(prop) {
  if (prop.type === 'bool') {
    return <CellBool {...prop} />
  } else if (prop.type === 'type-select') {
    return <CellTypeSelect {...prop} />
  } else {
    return <CellText {...prop} />
  }
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

function Info(prop) {
  const PKcount = prop.table.filter(v => {
    return v.data.ispk
  }).length
  return (
    <div style={{ marginTop: '50px' }}>
      <div>{prop.table.length + '行あるよ'}</div>
      <div>{'PKは' + PKcount + '個あるよ'}</div>
    </div>
  )
}

export default App
