import type { JSX } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteEProps {
  children: JSX.Element
}

function ProtectedRouteE({ children }: ProtectedRouteEProps) {
  const session = localStorage.getItem("session")
  const roleId = session ? Number(session) : null
  if (!roleId || (roleId !== 7 && roleId !== 8)) return <Navigate to="/" replace />
  return children
}

export default ProtectedRouteE
