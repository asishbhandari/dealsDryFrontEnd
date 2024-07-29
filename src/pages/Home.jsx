import NavLinks from "../Component/NavLinks";

const Home = () => {
  return (
    <div className="container">
      <NavLinks />
      <h2 className="heading">Dashboard</h2>
      <span
        style={{
          display: "flex",
          width: "100%",
          height: "60vh",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
        }}
      >
        Welcome to Admin Panel
      </span>
    </div>
  );
};

export default Home;
