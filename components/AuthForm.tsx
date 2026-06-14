"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AuthForm() {
	const [esRegistro, setEsRegistro] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const [cargando, setCargando] = useState(false)

	const manejarSubmit = async () => {
		setError("")
		setCargando(true)

		if (esRegistro) {
			const { error } = await supabase.auth.signUp({ email, password })
			if (error) setError(error.message)
		} else {
			const { error } = await supabase.auth.signInWithPassword({ email, password })
			if (error) setError(error.message)
		}
		setCargando(false)
	}

	return (
		<main className="min-h-screen flex item-center justify-center p-8">
			<div className="w-full max-w-sm">
				<h1 className="text-2xl font-bold mb-2">
					{esRegistro ? "Crear cuenta" : "Iniciar sesión"}
				</h1>
				<p className="text-gray-500 mb-6">
					{esRegistro ? "Registrate para empezar" : "Ingresa tu cuenta"}
				</p>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					className="w-full p-3 border rounded-lg mb-3"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Ingrese su contraseña"
					className="w-full p-3 border rounded-lg mb-3"
				/>
				<button
					onClick={manejarSubmit}
					disabled={cargando}
					className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
				>
					{cargando ? "Cargando..." : esRegistro ? "Registrarse" : "Iniciar sesión"}
				</button>
				<p className="text-sm text-gray-500 mt-4 text-center">
					{esRegistro ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
					<button
						onClick={() => setEsRegistro(!esRegistro)}
						className="text-blue-500 hover:underline"
					>
						{esRegistro ? "Inicia sesión" : "Regístrate"}
					</button>
				</p>
			</div>
		</main>
	)
}