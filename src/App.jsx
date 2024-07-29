import "./App.css";
import Header from "./Component/Header";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EmployeeList from "./pages/EmployeeList";
import CreateNewEmployee from "./pages/CreateNewEmployee";
import EditEmployee from "./pages/EditEmployee";

function Container() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
function ProtectedRoute() {
  let token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Container />}>
        <Route index element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Home />} />
          <Route path="employeeList" element={<EmployeeList />} />
          <Route path="createEmployee" element={<CreateNewEmployee />} />
          <Route path="editEmployee/:empId" element={<EditEmployee />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
