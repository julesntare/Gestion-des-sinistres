import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface PublicRoute {
  children: JSX.Element
}

function PublicRoute({ children }: { children: JSX.Element }) {
  const session = localStorage.getItem("session")
  const roleId = session ? Number(session) : null

  if (roleId === 7) return <Navigate to="/home" replace />
  if (roleId === 8) return <Navigate to="/homeexpert" replace />
  if (roleId === 9) return <Navigate to="/homeclient" replace />

  return children
}

export default PublicRoute
