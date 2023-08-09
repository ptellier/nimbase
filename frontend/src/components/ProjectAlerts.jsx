import { Outlet } from "react-router-dom";
import { createContext, useState } from "react";
import QueryAlert from "./QueryAlert";

export const AlertsContext = createContext({});

const ProjectAlerts = ({}) => {
  const [alerts, setAlerts] = useState([]);

  const deleteAlert = (index) => {
    let newAlerts = [...alerts];
    newAlerts.splice(index, 1);
    setAlerts(newAlerts);
  };

  const createAlert = (alert) => {
    let newAlerts = [...alerts];
    newAlerts.push(alert);
    setAlerts(newAlerts);
  };

  return (
    <>
      <div style={{ position: "fixed", zIndex: 1000, width: "100%" }}>
        {alerts.map((alert, i) => (
          <QueryAlert
            key={"query-alert-" + i}
            {...alert}
            handleClose={() => deleteAlert(i)}
          />
        ))}
      </div>

      <AlertsContext.Provider value={{ alerts, createAlert, deleteAlert }}>
        <Outlet />
      </AlertsContext.Provider>
    </>
  );
};

export default ProjectAlerts;
