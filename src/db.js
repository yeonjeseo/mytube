import mongoose from "mongoose";
// db url : mongodb://127.0.0.1:27017/
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB ✅ ");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);
//open occurs only once
db.once("open", handleOpen);
