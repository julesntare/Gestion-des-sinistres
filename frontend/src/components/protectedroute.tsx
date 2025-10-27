import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: JSX.Element
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = localStorage.getItem("session")
  const roleId = session ? Number(session) : null
  if (!roleId) return <Navigate to="/" replace />
  if (roleId === 6) return <Navigate to="/homeclient" replace />
  if (roleId === 8) return <Navigate to="/homeexpert" replace />

  return children
}

export default ProtectedRoute
