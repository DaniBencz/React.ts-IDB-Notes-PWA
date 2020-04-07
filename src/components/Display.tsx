import React, { useEffect, useState } from 'react'

const Note = (props: any) => {
  const { db, note, updateDisplay } = props

  const deleteNote = () => {
    const transaction = db.transaction('notes_os', 'readwrite')
    transaction.objectStore('notes_os').delete(note.id)
    transaction.oncomplete = () => updateDisplay()
  }

  return (
    <div id="note">
      <ul>
        <li>
          <h3>{note.title}</h3>
          <button onClick={deleteNote}>Delete Note</button>
          <p>{note.descr}</p>
        </li>
      </ul>
    </div>
  )
}

interface Note { id: number, title: string, descr: string }

const Display = (props: any) => {
  const { db } = props
  let [notes, setNotes] = useState<Note[]>([])
  let [reRender, setReRender] = useState<number>(1)

  useEffect(() => {
    setNotes([])  // empty state before beginning to refill it, else we end up with duplicates of old entries
    if (db) {
      let objectStore = db.transaction('notes_os').objectStore('notes_os')
      objectStore.openCursor().onsuccess = (e: any) => {  // iterate over object store entries

        let cursor = e.target.result
        if (cursor) {
          // setNotes([...notes, { title: cursor.value.title, descr: cursor.value.descr }])
          setNotes(prev => [...prev, {
            id: cursor.value.id,
            title: cursor.value.title,
            descr: cursor.value.description
          }])
          cursor.continue() // continue to next iteration
        }
      }
    }
  }, [db, reRender])  // if no 2nd parameter, re-execute on every render

  const updateDisplay = () => {
    setReRender(reRender === 1 ? 2 : 1)
  }

  return (
    <div id="display">
      <h2>Notes</h2>
      {notes.map((note: Note) => {
        return <Note key={note.id} db={db} note={note} updateDisplay={updateDisplay}></Note>
      })}
    </div >
  )
}

export default Display