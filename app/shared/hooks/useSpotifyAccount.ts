import { SpotifyAccount } from "../types";
import API from "../api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useToken } from "./useToken";

export const accountQuery = (token: string | undefined) =>
  queryOptions({
    queryKey: ["ACCOUNT"],
    queryFn: () =>
      API.get<SpotifyAccount>("v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

export const useSpotifyAccount = () => {
  const token = useToken();

  return useQuery({
    ...accountQuery(token),
    select: (response) => response.data,
    enabled: !!token,
  });
};
