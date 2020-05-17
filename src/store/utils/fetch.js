import { auth } from "firebase";
import fetch from "fetch-with-fire";
import { apiUrl } from "@/config";

function errorHandler(error) {
  // Only log in non production environments
  if (process.env.NODE_ENV !== "production") console.error(error);
  return error;
}

export default fetch(auth, apiUrl, errorHandler);
