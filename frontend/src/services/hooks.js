import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import axios from "axios";

export const useApiClient = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const setupClient = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const api = axios.create({
          baseURL: "/api",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClient(api);
      }
    };

    setupClient();
  }, [getAccessTokenSilently, isAuthenticated]);

  return client; // can be null before token loads
};
