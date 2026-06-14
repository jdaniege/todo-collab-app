"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Tarea {
  id: string
  texto: string
  completada: boolean
}

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [nuevaTarea, setNuevaTarea] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarTareas()
  }, [])

  const cargarTareas = async () => {
    const { data, error } = await supabase
      .from("tareas")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) console.error(error)
    else setTareas(data || [])
    setCargando(false)
  }

  const agregarTarea = async () => {
    if (nuevaTarea.trim() === "") return

    const { data, error } = await supabase
      .from("tareas")
      .insert({ texto: nuevaTarea, completada: false })
      .select()
      .single()

    if (error) console.error(error)
    else {
      setTareas([...tareas, data])
      setNuevaTarea("")
    }
  }

  const toggleTarea = async (id: string, completada: boolean) => {
    const { error } = await supabase
      .from("tareas")
      .update({ completada: !completada })
      .eq("id", id)

    if (error) console.error(error)
    else setTareas(tareas.map(t =>
      t.id === id ? { ...t, completada: !completada } : t
    ))
  }

  const eliminarTarea = async (id: string) => {
    const { error } = await supabase
      .from("tareas")
      .delete()
      .eq("id", id)

    if (error) console.error(error)
    else setTareas(tareas.filter(t => t.id !== id))
  }

  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Mi To-Do App 🚀</h1>
      <p className="text-gray-500 mt-2 mb-8">Lista de tareas colaborativa</p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarTarea()}
          placeholder="Escribe una tarea..."
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={agregarTarea}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Agregar
        </button>
      </div>

      {cargando ? (
        <p className="text-gray-400">Cargando tareas...</p>
      ) : (
        <ul className="space-y-3">
          {tareas.map((tarea) => (
            <li key={tarea.id} className="p-4 bg-white border rounded-lg shadow-sm flex justify-between items-center text-black">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() => toggleTarea(tarea.id, tarea.completada)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className={tarea.completada ? "line-through text-black" : ""}>
                  {tarea.texto}
                </span>
              </div>
              <button
                onClick={() => eliminarTarea(tarea.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-gray-400 mt-6">
        {tareas.filter(t => t.completada).length} de {tareas.length} tareas completadas
      </p>
    </main>
  )
}