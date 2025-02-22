import { SpotifyAccount } from "../types";
import API from "../api";
import { useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

export const useSpotifyAccount = () => {
  const token = useToken();

  return useQuery({
    queryKey: ["ACCOUNT"],
    queryFn: () =>
      API.get<SpotifyAccount>("v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    select: (response) => response.data,
    enabled: !!token,
  });
};
