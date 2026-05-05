import { useMonth } from "../context/MonthContext";

export const GlobalMonthPicker = () => {
  const { selectedMonth, setSelectedMonth } = useMonth();

  return (
    <div className="d-flex align-items-center gap-2">
      <label className="small text-muted mb-0">Mes global</label>
      <input
        className="form-control form-control-sm"
        style={{ width: "150px" }}
        type="month"
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
      />
    </div>
  );
};
