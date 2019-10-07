import React, { useState } from 'react'
import './App.scss'

const items = [
  { name: 'カラム名', type: 'text' },
  { name: '論理名', type: 'alphabet' },
  { name: 'is PK', type: 'bool' },
  { name: 'データ元', type: 'text' },
]

function Row(prop) {
  return (
    <>
      {prop.row.map(r => (
        <tr key={r[0]}>
          {r.map(i => (
            <td key={i}>{i}</td>
          ))}
        </tr>
      ))}
    </>
  )
}

function App() {
  const [row, setRow] = useState([])

  return (
    <div className="App">
      <div className="App-title">テーブルを作るよ</div>
      <table className="App-table">
        <tr>
          {items.map(v => (
            <th key={v.name}>{v.name}</th>
          ))}
        </tr>
        <Row row={row} />
        <tr className="App-addrow">
          <td
            onClick={() => {
              const r = row.slice()
              const i = row.length;
              r.push(['ああ'+i, 'いい'+i, 'うう'+i, 'ええ'+i])
              setRow(r)
            }}
          >
            ここをクリックしてね
          </td>
        </tr>
      </table>
    </div>
  )
}

export default App
