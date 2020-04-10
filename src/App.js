import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table'
import './App.css';

const API_BASE = 'https://my-json-server.typicode.com/Lukashev/gameofthrones'

const tableColumns = [
  { title: 'Name', field: 'name' },
  { title: 'Description', field: 'description' },
  { title: 'Cause of death', field: 'deathCause' },
  { title: 'Killed by', field: 'killedBy' },
  { title: 'Murder weapon', field: 'murderWeapon' },
]


function App() {

  const [allCharacters, setCharacters] = useState([])
  const [searchResult, setSearchResult] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/characters`)
      .then(response => response.json())
      .then(allCharacters => {
        setLoading(false)
        setCharacters(allCharacters)
      })
  }, [])

  const onRowAdd = useCallback(newData => {
    return new Promise((resolve, reject) => {
      try {
        const fieldLength = Object.keys(newData).length
        if (fieldLength !== tableColumns.length) {
          alert('All fields are required!')
        } else {
          setLoading(true)
          console.log(newData)
          fetch(`${API_BASE}/characters`, {
            method: 'POST',
            body: JSON.stringify(newData),
            headers: {
              "Content-type": "application/json"
            }
          })
          .then(response => response.json())
          .then(result => {
            setLoading(false)
            setCharacters(allCharacters.concat(result))
          })
        }
        resolve()
      } catch(e) {
        reject(e.message)
      }
    })
  })

  return (
    <div className="App">
      <MaterialTable
        title="Game Of Thrones"
        columns={tableColumns}
        data={allCharacters}
        isLoading={isLoading}
        style={{ maxWidth: 768, margin: '25px auto' }}
        editable={{
          onRowAdd,
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                 
                }
                resolve()
              }, 1000)
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                 
                }
                resolve()
              }, 1000)
            }),
        }}
      />
    </div>
  );
}

export default App;
