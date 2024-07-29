import { useEffect, useState } from "react";
import NavLinks from "../Component/NavLinks";
import { useNavigate } from "react-router-dom";
import { loadData } from "../redux/Feature/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { BASE_URL } from "../constant";
import { toast, Zoom } from "react-toastify";

const columns = [
  {
    header: "UniqueId",
    accessorKey: "uniqueId",
  },
  {
    header: "Image",
    accessorKey: "image",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Mobile No",
    accessorKey: "mobileNo",
  },
  {
    header: "Designation",
    accessorKey: "designation",
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
  {
    header: "Course",
    accessorKey: "course",
  },
  {
    header: "Create Date",
    accessorKey: "createDate",
  },
  {
    header: "Action",
    accessorKey: "action",
  },
];
// const page = 1;
const pageSize = 4;

const EmployeeList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalEmp, setTotalEmp] = useState(1);
  const [page, setPage] = useState(0);
  const [asc, setAsc] = useState(false);
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.employee?.employees);

  const handleEdit = (index) => {
    navigate(`/editEmployee/:${index}`);
  };

  const handleSearch = () => {
    const searchEmp = async () => {
      const response = await fetch(
        `${BASE_URL}/v1/employee/allDetails/?search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.Details) {
        const emp = data.Details?.map((detail) => {
          const empDetail = {
            uniqueId: detail._id,
            image: detail.image,
            name: detail.name,
            email: detail.email,
            mobileNo: detail.mobileNo,
            designation: detail.designation,
            gender: detail.gender,
            courses: detail.courses,
            createDate: moment(detail.createdAt).format("DD MMM YYYY"),
            action: ["Edit", "Delete"],
          };
          return empDetail;
        });
        dispatch(loadData(emp));
        setTotalEmp(data.Total);
      }
    };
    searchEmp();
  };

  const handleDelete = (id) => {
    const removeEmp = async () => {
      const response = await fetch(
        `${BASE_URL}/v1/employee/removeEmployee/:${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.message === "Employee does not exist") {
        toast.warn("Employee does not exist", { transition: Zoom });
      } else if (data.message === "Removed Employee successfully") {
        // navigate("/employeeList");
        window.location.reload();
        setTimeout(
          () =>
            toast.success("Removed Employee successfully", {
              transition: Zoom,
            }),
          600
        );
      } else {
        toast.error("Something went wrong", { transition: Zoom });
      }
    };
    removeEmp();
  };

  const sortEmp = (arr) => {
    return asc
      ? arr.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        })
      : arr.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return 1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return -1;
          }
          return 0;
        });
  };

  const handleSort = (e) => {
    if (e === "name") {
      setAsc((pre) => !pre);
      const sortedEmployee = sortEmp([...data]);
      setData(sortedEmployee);
      console.log(data);
    }
  };
  const totalEmployee = data.length;

  const handleCreateEmployee = () => {
    navigate("/createEmployee");
  };

  useEffect(() => {
    setData(employeeData);
  }, [employeeData]);

  useEffect(() => {
    handleSearch();
  }, [page]);

  // updating list of all the employees
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/v1/employee/allDetails`, {
        method: "GET",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.Details) {
        const emp = data.Details?.map((detail) => {
          const empDetail = {
            uniqueId: detail._id,
            image: detail.image,
            name: detail.name,
            email: detail.email,
            mobileNo: detail.mobileNo,
            designation: detail.designation,
            gender: detail.gender,
            courses: detail.courses,
            createDate: moment(detail.createdAt).format("DD MMM YYYY"),
            action: ["Edit", "Delete"],
          };
          return empDetail;
        });
        dispatch(loadData(emp));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <NavLinks />

      <h2 className="heading">EmployeeList</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "1rem",
          marginRight: "1rem",
          marginTop: "0.5rem",
          fontSize: "1.2rem",
        }}
      >
        <span>{`Total Count: ${totalEmployee}`}</span>
        <span
          style={{
            borderRadius: "0.3rem",
            backgroundColor: "green",
            color: "white",
            padding: "0.3rem",
            cursor: "pointer",
          }}
          onClick={handleCreateEmployee}
        >
          Create Employee
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "1rem",
          gap: "0.5rem",
        }}
      >
        <input
          style={{ minWidth: "20rem" }}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessorKey}
                    onClick={() => handleSort(col.accessorKey)}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(page, page + pageSize).map((emp, i) => (
                <tr key={i}>
                  {Object.entries(emp).map((entry, j) => (
                    <td key={Math.PI + j}>
                      {entry[0] === "uniqueId" ? (
                        "..." + entry[1].substring(entry[1].length - 5)
                      ) : entry[0] === "image" ? (
                        <img
                          style={{
                            width: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            height: "40px",
                          }}
                          src={entry[1]}
                          alt="employeePhoto"
                        />
                      ) : entry[0] === "courses" ? (
                        Object.entries(entry[1])
                          .filter((en) => en[1] === true)
                          .map((a) => a[0])
                          .join(", ") || "---"
                      ) : entry[0] === "action" ? (
                        <span style={{ display: "flex", gap: "0.5rem" }}>
                          <span
                            onClick={() => handleEdit(emp?.uniqueId)}
                            style={{ cursor: "pointer" }}
                            className="hover"
                          >
                            {entry[1][0]}
                          </span>
                          <span
                            onClick={() => handleDelete(emp?.uniqueId)}
                            style={{ cursor: "pointer" }}
                            className="hover"
                          >
                            {entry[1][1]}
                          </span>
                        </span>
                      ) : (
                        entry[1]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              disabled={page === 0}
              onClick={() => setPage((pre) => pre - pageSize)}
            >
              ◀️
            </button>
            {Array.from({ length: Math.floor(totalEmp / pageSize) + 1 }).map(
              (_, i) => (
                <span
                  style={{
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "0.3rem",
                    backgroundColor: "green",
                    color: "white",
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "0.3rem",
                    marginInline: "0.3rem",
                  }}
                  key={i}
                >
                  {i + 1}
                </span>
              )
            )}
            <button
              disabled={
                page ===
                (Math.floor(totalEmp / pageSize) > 0
                  ? Math.floor(totalEmp / pageSize)
                  : 1)
              }
              onClick={() => setPage((pre) => pre + pageSize)}
            >
              ▶️
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default EmployeeList;
