import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const DepartmentContext = createContext(null);

export const DepartmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      setDepartments([]);
      setSelectedDepartment("");
      return;
    }

    api.get("/employees/departments").then(({ data }) => {
      setDepartments(data);
      if (!selectedDepartment && data.length > 0) {
        setSelectedDepartment(data[0]);
      }
    });
  }, [user]);

  return (
    <DepartmentContext.Provider
      value={{ departments, selectedDepartment, setSelectedDepartment }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => useContext(DepartmentContext);
