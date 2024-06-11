import { axiosInstance } from "@/lib/axios";
import useSWR from "swr";

const assistantFetcher = async (_: string) => {
  const response = await axiosInstance.get("/assistant?query=ALL");
  return response.data;
};

/**
 * Fetches all assistant related data, and provides all apis to mutate assistant data.
 */
export default function useAssistant() {
  const {
    data: assistants,
    error,
    isLoading: isFetchingAssistants,
    mutate,
  } = useSWR("assistant", assistantFetcher);
  return { assistants, error, mutate, isFetchingAssistants };
}
