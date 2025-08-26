import axios from "axios";

import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_BACKEND_URL;
export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const notify = () => {
    toast.success("Signup Successful, Welcome!");
  };
  const signup = async (email, password, username) => {
    setIsLoading(true);
    setError(null);

    //console.log(email, password, username);
    const user = { email, password, username };
    try {
      const response = await axios.post(
        `${API_URL}/api/user/signup`,
        user
      );
      const result = response.data;
      if (response.status === 201) {
        setError(null);
        setIsLoading(false);
        notify();
        // save the token in local storage
        localStorage.setItem("user", JSON.stringify(result));
        // update the dispatch
        dispatch({ type: "LOGIN", payload: result });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError(error.message || "An unknown error occurred");
      }
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error, setError };
};
