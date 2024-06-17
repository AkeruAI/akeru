import { axiosInstance } from "@/lib/axios";
import useSWR from "swr";

const threadsFetcher = async (_: string) => {
  const response = await axiosInstance.get("/thread");
  return response.data;
};

/**
 * Fetches all threads related data, and provides all apis to mutate thread data.
 */
export default function useThreads() {
  const {
    data: threads,
    error,
    isLoading: isFetchingThreads,
    mutate,
  } = useSWR("assistant", threadsFetcher);
  return { threads, error, mutate, isFetchingThreads };
}
