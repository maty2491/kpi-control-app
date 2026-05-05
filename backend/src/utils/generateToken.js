import jwt from "jsonwebtoken";

export const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      department: user.department,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
