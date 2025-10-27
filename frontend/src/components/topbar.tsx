import { useNavigate } from "react-router-dom"

function Topbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("session")
    navigate("/")
  }

  // Get session from localStorage
  const session = localStorage.getItem("session")
  const roleId = session ? Number(session) : null

  // Map roleId to role name
  const roleName =
    roleId === 7 ? "Admin" :
    roleId === 8 ? "Expert" :
    roleId === 6 ? "Client" :
    "Guest"

  return (
    <header className="h-16 flex items-center justify-between px-6 shadow-md border-b bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      {/* Logo / Title */}
      <h1 className="font-bold text-lg tracking-wide">Serenity Insurance Company</h1>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* 🔹 Show Home button only for Clients (roleId = 6) */}
        {roleId === 6 && (
          <button
            onClick={() => navigate("/homeclient")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-blue-600 transition-colors duration-200"
          >
            <i className="fa-solid fa-house"></i>
            Accueil
          </button>
        )}

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold uppercase">
            {roleName.charAt(0)}
          </div>
          <span className="hidden sm:inline font-medium">{roleName}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/20 hover:bg-red-500 transition-colors duration-200"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Se déconnecter
        </button>
      </div>
    </header>
  )
}

export default Topbar
