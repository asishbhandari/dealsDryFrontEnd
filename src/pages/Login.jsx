import { useEffect, useState } from "react";
import { BASE_URL } from "../constant";
import { useNavigate } from "react-router-dom";
import { toast, Zoom } from "react-toastify";

const Login = () => {
  const [userData, setUserData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (isSubmit) handleValidation();
  };

  const handleValidation = () => {
    let stateError = {};
    if (userData.userName?.trim() === "") {
      stateError.userName = "* User name is required";
    }
    if (userData.password?.trim() === "") {
      stateError.password = "* Password is required";
    }

    setError(stateError);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleValidation();
    setIsSubmit(true);
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const response = await fetch(`${BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data?.message === "user Credential does not match") {
        toast.warn("user Credential does not match", { transition: Zoom });
      } else if (data?.error) {
        toast.error("You are not authorized", { transition: Zoom });
      } else if (data) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("User", data.userName);
        toast.success("Login successful", { transition: Zoom });
        navigate("/dashboard");
      }
    };
    if (Object.keys(error).length === 0 && isSubmit) {
      fetchAdmin();
      setIsSubmit(false);
    }
  }, [error, isSubmit]);

  return (
    <div className="login-page">
      <h2 className="heading">Login Page</h2>
      <form onSubmit={handleSubmit}>
        <h3
          style={{
            textAlign: "center",
            backgroundColor: "green",
            color: "white",
            paddingBlock: "0.3rem",
          }}
        >
          User details
        </h3>
        <div>
          <label htmlFor="userName">User Name </label>
          <input
            name="userName"
            type="text"
            value={userData.userName}
            onChange={handleChange}
            placeholder="Enter User Name"
          />
        </div>
        {error && error.userName && <p className="error">{error.userName}</p>}

        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            value={useState.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />
        </div>
        {error && error.password && <p className="error">{error.password}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
