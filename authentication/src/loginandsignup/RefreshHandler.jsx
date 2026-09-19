import { useEffect } from "react";
import axios from "axios";

export const RefreshHandler = ({ setauthenticated }) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/verify", {
          withCredentials: true 
        });

        if (res.data.authenticated) {
          setauthenticated(true);
        } else {
          setauthenticated(false);
        }
      } catch (err) {
        setauthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return null;
};