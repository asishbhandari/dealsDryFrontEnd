import EmployeeForm from "../Component/EmployeeForm";
import NavLinks from "../Component/NavLinks";

const CreateNewEmployee = () => {
  return (
    <div className="container">
      <NavLinks />
      <h2 className="heading">Create Employee</h2>

      <EmployeeForm type={"Add "} />
    </div>
  );
};

export default CreateNewEmployee;
