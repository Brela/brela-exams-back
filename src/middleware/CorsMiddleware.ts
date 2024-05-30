import cors from "cors";

const allowedOrigins = ["http://localhost:3000", "https://brela-exams-front.vercel.app/"];

export default cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
});
