"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import AuthForm from "@/components/AuthForm"  // ← NUEVO: importamos el formulario que creamos

interface Tarea {
  id: string
  texto: string
  completada: boolean
}

export default function Home() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [nuevaTarea, setNuevaTarea] = useState("")
  const [cargando, setCargando] = useState(true)

  // NUEVO: guardamos al usuario logueado (o null si no hay nadie)
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    // NUEVO: revisamos si ya hay una sesión activa al cargar la página
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user ?? null)
      setCargando(false)
    })

    // NUEVO: nos "suscribimos" a cambios de sesión
    // Esto se ejecuta automáticamente cuando el usuario hace login o logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null)
    })

    // NUEVO: limpieza — cuando el componente se destruye, cancelamos la suscripción
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Cargamos las tareas SOLO si hay un usuario logueado
    if (usuario) cargarTareas()
  }, [usuario])  // ← se ejecuta cada vez que "usuario" cambia

  const cargarTareas = async () => {
    const { data, error } = await supabase
      .from("tareas")
      .select("*")
      .order("created_at", { ascending: true })

    if (error) console.error(error)
    else setTareas(data || [])
  }

  const agregarTarea = async () => {
    if (nuevaTarea.trim() === "") return

    const { data, error } = await supabase
      .from("tareas")
      .insert({
        texto: nuevaTarea,
        completada: false,
        user_id: usuario.id  // ← NUEVO: guardamos a quién pertenece la tarea
      })
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

  // NUEVO: función para cerrar sesión
  const cerrarSesion = async () => {
    await supabase.auth.signOut()
  }

  // NUEVO: mientras revisamos si hay sesión, mostramos un mensaje simple
  if (cargando) {
    return <p className="p-8">Cargando...</p>
  }

  // NUEVO: si NO hay usuario logueado, mostramos el formulario de login
  if (!usuario) {
    return <AuthForm />
  }

  // Si llegamos aquí, hay un usuario logueado → mostramos la to-do list
  return (
    <main className="min-h-screen p-8 max-w-xl mx-auto">
      {/* NUEVO: barra superior con email del usuario y botón de salir */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Mi To-Do App 🚀</h1>
        <button onClick={cerrarSesion} className="text-sm text-red-400 hover:text-red-600">
          Cerrar sesión
        </button>
      </div>
      <p className="text-gray-500 mt-2 mb-8">{usuario.email}</p>

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

      <p className="text-sm text-gray-400 mt-6">
        {tareas.filter(t => t.completada).length} de {tareas.length} tareas completadas
      </p>
    </main>
  )
}