import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table'
import './App.css';

const API_BASE = 'http://localhost:1313'

const tableColumns = [
  { title: 'Name', field: 'name' },
  { title: 'Description', field: 'description', filtering: false },
  { title: 'Cause of death', field: 'deathCause' },
  { title: 'Killed by', field: 'killedBy' },
  { title: 'Murder weapon', field: 'murderWeapon' },
]

function App() {

  const [allCharacters, setCharacters] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/characters`)
      .then(response => response.json())
      .then(allCharacters => {
        setLoading(false)
        setCharacters(allCharacters)
      })
  }, []) // eslint-desable-line

  const onRowAdd = useCallback(newData => {
    return new Promise((resolve, reject) => {
      const fieldLength = Object.keys(newData).length
      if (fieldLength !== tableColumns.length ||
        Object.keys(newData).some(key => newData[key] === '')) {
        alert('All fields are required!')
      } else {
        setLoading(true)
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
          .catch(e => reject(e.message))
      }
      resolve()
    })
  }, [allCharacters]) // eslint-disable-line

  const onRowDelete = useCallback(oldData => {
    return new Promise((resolve, reject) => {
      const { id } = oldData
      setLoading(true)
      fetch(`${API_BASE}/characters/${id}`, {
        method: 'DELETE'
      }).then(_data => {
        setLoading(false)
        setCharacters(allCharacters.filter(character => {
          return character.id !== id
        }))
      })
        .catch(e => reject(e.message))
      resolve()
    })
  }, [allCharacters]) // eslint-disable-line

  const onRowUpdate = useCallback(newData => {
    return new Promise((resolve, reject) => {
      const { id } = newData

      if (Object.keys(newData).some(key => newData[key] === '')) {
        alert('All fields are required!')
      } else {
        setLoading(true)
        fetch(`${API_BASE}/characters/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(newData),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        })
          .then(response => response.json())
          .then(result => {
            setLoading(false)
            const tmp = allCharacters.slice()
            const index = tmp.findIndex(character => character.id === id)
            tmp[index] = result
            setCharacters(tmp)
          })
          .catch(e => reject(e.message))
      }
      resolve()
    })
  }, [allCharacters]) // eslint-disable-line

  return (
    <div className="App">
      <MaterialTable
        title="Game Of Thrones"
        columns={tableColumns}
        data={allCharacters}
        isLoading={isLoading}
        style={{ maxWidth: 960, margin: '25px auto' }}
        editable={{
          onRowAdd,
          onRowUpdate,
          onRowDelete
        }}
        options={{
          filtering: true
        }}
      />
    </div>
  );
}

export default App;
