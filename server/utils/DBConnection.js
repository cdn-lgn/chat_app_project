import mongoose from "mongoose";

const connectDB = (URI) => {
  mongoose
    .connect(URI, {
      dbname: "mahgan",
    })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};
export { connectDB };
