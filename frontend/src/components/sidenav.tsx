import { Link, useLocation } from "react-router-dom"

interface MenuItem {
  to: string
  icon: string
  label: string
}

function Sidenav() {
  const session = localStorage.getItem("session")
  const roleId = session ? Number(session) : null
  const location = useLocation()

  // Menus for different roles
  const menus: Record<number, MenuItem[]> = {
    7: [
      { to: "/home", icon: "fa-solid fa-house", label: "Accueil" },
      { to: "/polices", icon: "fa-solid fa-file-shield", label: "Polices" },
      { to: "/sinistres", icon: "fa-solid fa-car-burst", label: "Sinistres" },
      { to: "/documents", icon: "fa-solid fa-file", label: "Documents" },
      { to: "/paiements", icon: "fa-solid fa-credit-card", label: "Paiements" },
      { to: "/expertise", icon: "fa-solid fa-magnifying-glass", label: "Expertise" },
      { to: "/experts", icon: "fa-solid fa-user-tie", label: "Experts" },
      { to: "/roles", icon: "fa-solid fa-user-shield", label: "Rôles" },
      { to: "/users", icon: "fa-solid fa-users", label: "Utilisateurs" },
    ],
    8: [
      { to: "/homeexpert", icon: "fa-solid fa-house", label: "Accueil" },
      { to: "/sinistre", icon: "fa-solid fa-car-burst", label: "Sinistre" },
      { to: "/document", icon: "fa-solid fa-file", label: "Document" },
      // { to: "/paiements", icon: "fa-solid fa-credit-card", label: "Paiements" },
      { to: "/expertises", icon: "fa-solid fa-magnifying-glass", label: "Expertises" },
    ],
  }

  const currentMenus = roleId ? menus[roleId] : []

  if (!currentMenus.length) return null

  return (
    <aside className="w-64 h-screen bg-white shadow-lg border-r flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xl tracking-wide">
        SINISFLOW
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-gray-500 text-xs uppercase font-semibold mb-3 pl-2">Menu principal</p>
        {currentMenus.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 mb-1 rounded-lg transition-colors duration-200 
                ${isActive ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <i className={`${item.icon} w-5`} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidenav
