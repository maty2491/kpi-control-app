import { createContext, useContext, useState } from "react";

const currentMonth = new Date().toISOString().slice(0, 7);
const MonthContext = createContext(null);

export const MonthProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  return (
    <MonthContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
};

export const useMonth = () => useContext(MonthContext);
