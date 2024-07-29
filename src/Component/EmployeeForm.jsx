import { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { useDispatch } from "react-redux";
// import { addEmployee } from "../redux/Feature/employeeSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constant";
import { toast, Zoom } from "react-toastify";
import { useSelector } from "react-redux";

const fields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Enter name",
    required: "true",
  },
  {
    label: "Email",
    name: "email",
    type: "text",
    placeholder: "Enter email address",
  },
  {
    label: "Mobile No.",
    name: "mobileNo",
    type: "number",
  },
  {
    label: "Designation",
    name: "designation",
    type: "dropdown",
    options: ["HR", "Developer", "sales", "Manager"],
  },
  {
    label: "Gender",
    name: "gender",
    type: "radio",
    options: ["Male", "Female"],
  },
  {
    label: "Courses",
    name: "courses",
    type: "checkbox",
    options: ["MCA", "BCA", "BSC"],
  },
  {
    label: "Image",
    name: "image",
    type: "file",
  },
];

const EmployeeForm = ({ type, emp = {} }) => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobileNo: "",
    designation: "Hr",
    gender: "",
    courses: {
      MCA: false,
      BCA: false,
      BSC: false,
    },
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const allEmployee = useSelector((state) => state.employee.employees);
  const emailArray = allEmployee.map((obj) => obj.email);

  useEffect(() => {
    if (Object.keys(emp).length !== 0) {
      setEmployee({
        name: emp.name || "",
        email: emp.email || "",
        mobileNo: emp.mobileNo || "",
        designation: emp.designation || "HR",
        gender: emp.gender || "",
        courses: emp.courses || {
          MCA: false,
          BCA: false,
          BSC: false,
        },
        image: emp.image || "",
      });
    }
  }, [emp, profilePicture]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEmployee((preEmployee) => ({
        ...preEmployee,
        courses: {
          ...preEmployee.courses,
          [value]: checked,
        },
      }));
    } else if (type === "file") {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        image: e.target.files[0],
      }));
    } else {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
    if (isSubmit) {
      validate();
    }
  };

  const handleImageChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const validate = () => {
    let tempErrors = {};
    // name validations
    if (employee.name.trim() === "") tempErrors.name = "cannot be empty*";

    // email validations
    if (type === "Add ") {
      if (employee.email.trim() === "") tempErrors.email = "cannot be empty*";
      else if (!/\S+@\S+\.\S+/.test(employee.email.trim()))
        tempErrors.email = "Enter Valid Email";
      else if (emailArray.includes(employee.email.trim()))
        tempErrors.email = "Email Already registered";
    }

    // mobileNo validations
    if (employee.mobileNo < 6000000000 || employee.mobileNo > 10000000000)
      tempErrors.mobileNo = "Invalid Mobile Number";

    // course validations
    if (!employee.courses.MCA && !employee.courses.BCA && !employee.courses.BSC)
      tempErrors.courses = "Please Select At least one";

    // image validations
    if (type === "Add " && !profilePicture)
      tempErrors.image = "Select image is necessary";
    setError(tempErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    setIsSubmit(true);
  };

  useEffect(() => {
    const addEmp = async () => {
      const formData = new FormData();
      formData.append("name", employee.name);
      formData.append("email", employee.email);
      formData.append("mobileNo", employee.mobileNo);
      formData.append("designation", employee.designation);
      formData.append("gender", employee.gender);
      if (type === "Add ")
        formData.append("courses", JSON.stringify(employee.courses));
      if (profilePicture) formData.append("image", profilePicture);

      setLoading(true);
      let response;
      if (type === "Edit ") {
        response = await fetch(`${BASE_URL}/v1/employee/updateEmployee`, {
          method: "PATCH",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${BASE_URL}/v1/employee/addEmployee`, {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: formData,
        });
      }
      const newEmp = await response.json();
      if (
        newEmp.message === "user Created successfully" ||
        newEmp.message === "Employee Updated Successfully"
      ) {
        type === "Add "
          ? toast.success("User added successfully", { transition: Zoom })
          : toast.success("User updated successfully", { transition: Zoom });
        setIsSubmit(false);
        setLoading(false);
        navigate("/employeeList");
      }
    };
    if (Object.keys(error).length === 0 && isSubmit) {
      addEmp();
    }
  }, [error, isSubmit, employee]);

  return (
    <>
      <form className="empDetails" onSubmit={handleSubmit}>
        <h3
          style={{
            textAlign: "center",
            backgroundColor: "green",
            color: "white",
            paddingBlock: "0.3rem",
            marginBlock: "0",
          }}
        >
          {type}Employee Details
        </h3>
        {fields.map((field, i) => (
          <div key={Math.PI * 3 + i}>
            <div key={i} className="empDetails_container">
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "dropdown" ? (
                <select
                  name={field.name}
                  value={employee[field.name]}
                  onChange={handleChange}
                  style={{ flexGrow: "1", height: "1.5rem" }}
                >
                  {field?.options?.map((option, j) => (
                    <option key={Math.PI + j} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "radio" ? (
                field?.options?.map((option, j) => (
                  <div
                    key={Math.PI * j}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="radio"
                      id={field.name + option}
                      name={field.name}
                      value={option}
                      onChange={handleChange}
                      checked={employee[field.name] === option}
                    />
                    <label htmlFor={field.name + option}>{option}</label>
                  </div>
                ))
              ) : field.type === "checkbox" ? (
                field?.options?.map((option, j) => (
                  <div
                    key={Math.PI * 2 + j}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <input
                      type="checkbox"
                      id={field.name + option}
                      name={field.name}
                      value={option}
                      onChange={handleChange}
                      checked={employee.courses[option]}
                    />
                    <label htmlFor={field.name + option}>{option}</label>
                  </div>
                ))
              ) : field.type === "file" ? (
                <>
                  {type === "Edit " && (
                    <img
                      style={{ width: "40px", height: "40px" }}
                      src={emp.image}
                      alt="employeeImage"
                    />
                  )}
                  <input
                    type={field.type}
                    placeholder={field?.placeholder}
                    name={field.name}
                    onChange={handleImageChange}
                    style={{
                      borderColor: `${error[field.name] ? "red" : ""}`,
                    }}
                  />
                </>
              ) : (
                <input
                  type={field.type}
                  placeholder={field?.placeholder}
                  name={field.name}
                  disabled={type === "Edit " && field.name === "email"}
                  value={employee[field.name]}
                  onChange={handleChange}
                  style={{
                    borderColor: `${error[field.name] ? "red" : ""}`,
                  }}
                />
              )}
            </div>
            {error && error[field.name] && (
              <p
                style={{
                  color: "red",
                  margin: "0",
                  fontSize: "0.8rem",
                  textAlign: "end",
                }}
              >
                {error[field.name]}
              </p>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      {loading && <p className="loader"></p>}
    </>
  );
};

EmployeeForm.propTypes = {
  type: PropTypes.string,
  emp: PropTypes.object,
};

export default EmployeeForm;
