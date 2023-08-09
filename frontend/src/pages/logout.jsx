import Query from "../components/Query";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { Button } from "@chakra-ui/react";

const Logout = () => {
  const query = new Query();
  const [user, setUser] = useState(null);
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await query.logoutUser();
      window.location.href = "/";
      setUser(null);
    } catch (error) {
      console.log("Error in logout: ", error);
    }
  };

  return (
    <div className="background-image">
      <NavBar />
      <div className="login-container">
        <div className="login-box">
          <h2>Logout</h2>
          <form onSubmit={handleLogout}>
            <Button variant="customDefault" type="submit">
              Log Out
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
