export const buildEmployeeScope = (user) => {
  if (user.role === "admin") {
    return {};
  }

  return {
    supervisor: user._id,
    department: user.department,
  };
};

export const assertManagerOwnsEmployee = (user, employee) => {
  if (user.role === "admin") {
    return true;
  }

  return (
    String(employee.supervisor) === String(user._id) &&
    employee.department === user.department
  );
};
