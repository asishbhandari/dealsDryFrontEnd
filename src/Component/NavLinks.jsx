import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";

const NavLinks = () => {
  const navigate = useNavigate();
  const navLink = [
    { name: "Home", id: 101, link: "/dashboard", isActive: false },
    { name: "Employee List", id: 102, link: "/employeeList", isActive: false },
  ];
  const user = localStorage.getItem("User") || "No User";

  const handleLogout = () => {
    //clear token from local storage
    localStorage.removeItem("User");
    localStorage.removeItem("token");
    toast.success("User logged out", { transition: Zoom });
    navigate("/");
  };
  useEffect(() => {
    navLink[0].isActive = true;
  }, []);

  return (
    <nav className="navLinks">
      <span className="linkTab">
        {navLink.map((item) => (
          <NavLink
            className={`link ${item.isActive ? "active" : ""}`}
            key={item.id}
            to={item.link}
          >
            {item.name}
          </NavLink>
        ))}
      </span>
      <span className="userTab">
        <h2 style={{ cursor: "pointer" }}>{user}</h2>
        <h2 onClick={handleLogout} style={{ cursor: "pointer" }}>
          logout
        </h2>
      </span>
    </nav>
  );
};

export default NavLinks;
