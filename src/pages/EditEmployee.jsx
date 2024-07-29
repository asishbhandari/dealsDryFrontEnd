import { useParams } from "react-router-dom";
import EmployeeForm from "../Component/EmployeeForm";
import NavLinks from "../Component/NavLinks";
import { useSelector } from "react-redux";

const EditEmployee = () => {
  const empId = useParams("empId");
  const employee = useSelector((state) => state.employee.employees);
  const selectedEmployee = employee.filter(
    (emp) => emp.uniqueId === empId.empId.substring(1)
  );
  return (
    <div className="container">
      <NavLinks />
      <h2 className="heading">Edit Employee</h2>

      <EmployeeForm type={"Edit "} emp={selectedEmployee[0]} />
    </div>
  );
};

export default EditEmployee;
