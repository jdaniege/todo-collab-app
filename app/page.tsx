"use client"
import { useState } from "react"

export default function Home() {
  const [tareas, setTareas] = useState([
    "Aprender Next.js",
    "Crear mi primera App",
    "Subir a Github"
  ])

  const [nuevaTarea, setNuevaTarea] = useState("")

  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") return
    setTareas([...tareas, nuevaTarea])
    setNuevaTarea("")
  }
  const eliminarTarea = (index: number) => {
    setTareas(tareas.filter((_, i) => i !== index)) 
  }

  
return (
  <main className="min-h-screen p-8 max-w-xl mx-auto">
    <h1 className="text-3xl font-bold">Mi To-Do App</h1>
    <p className="text-gray-500 mt-2 mb-8">Lista de tareas colaborativas</p>
  
  {/* Input para agregar las tareas */}
  <div className="flex gap-2 mb-6">
    <input
      type="text"
      value={nuevaTarea}
      onChange={(e) => setNuevaTarea(e.target.value)}
      placeholder="Escribe una tarea..."
      className="flex-1 p-3 border rounded-lg" />
 
    <button onClick={agregarTarea}
    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">

      Agregar
    </button>
  </div>
  
  {/* Input para agregar las tareas */}

  <ul className="space-y-3">
    {tareas.map((tarea, index) => (
      <li key={index} className="p-4 bg-white border rounded-lg shadow-sm text-gray-300 flex justify-between items-center">
        {tarea}
        <button  onClick={() => eliminarTarea(index)}
          className="text-red-400 hover:text-red-600 text-sm">
         Eliminar
        </button>
        </li>

    ))}

    


  </ul>
  </main>
)
}

 