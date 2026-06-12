"use client"
import { useState } from "react"

interface Tarea {
id: number
texto: string
completada: boolean
}

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: 1, texto: "Aprender Next.js", completada: false},
    { id: 2, texto: "Crear mi primera App", completada: false},
    { id: 3, texto: "Subir a Github", completada: false}
  ])

  const [nuevaTarea, setNuevaTarea] = useState("")

  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") return
    setTareas([...tareas, {
      id: Date.now(),
      texto: nuevaTarea,
      completada: false

    }])
    setNuevaTarea("")
  }
  const toggleTarea = (id: number) => {
    setTareas(tareas.map(t => t.id === id ? {...t, completada: !t.completada} : t ))
  }
const eliminarTarea = (id: number) => {
  setTareas(tareas.filter(t => t.id !== id))
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
      onKeyDown={(e) =>  e.key === "Enter" && agregarTarea()}
      placeholder="Escribe una tarea..."
      className="flex-1 p-3 border rounded-lg" />
 
    <button onClick={agregarTarea}
    className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">

      Agregar
    </button>
  </div>
  
  {/* Input para agregar las tareas */}

  <ul className="space-y-3">
    {tareas.map((tarea) => (
      <li key={tarea.id} className="p-4 bg-white border rounded-lg shadow-sm text-gray-300 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox"
            checked={tarea.completada}
            onChange={() => toggleTarea(tarea.id)}
            className="w-4 h-4 cursor-pointer"
            />
            <span className={tarea.completada ? "line-through text-gray-400" : "text-gray-700"}>
            {tarea.texto}
            </span>
        </div>
        <button 
        onClick={() => eliminarTarea(tarea.id)}
        className="text-red-400 hover:text-red-600 text-sm">
          Eliminar
        </button>
        </li>
       ))}

      </ul>
      <p className="text-sm text-gray-400 mt-6">
        {tareas.filter(t => t.completada) .length} de {tareas.length} tareas completadas
      </p>
    </main>
  )
}

 