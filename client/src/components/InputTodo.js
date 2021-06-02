import React, { useState } from "react"

export default function InputTodo() {
  const [description, setDescription] = useState("")

  function handleDescription(e) {
    setDescription(e.target.value)
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { description }
      const response = await fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      console.log(response)
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <div>
      <h1 className="text-center mt-5">Pern Todo List</h1>
      <form onSubmit={onSubmitForm} className="d-flex mt-5">
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={handleDescription}
        />
        <button className="btn btn-success">Add</button>
      </form>
    </div>
  )
}
