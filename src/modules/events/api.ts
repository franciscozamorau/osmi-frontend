import { api } from "@/lib/api";
import { EventListResponse } from "./types";

export const eventsApi = {
  async list(page: number = 1, pageSize: number = 20): Promise<EventListResponse> {
    return api.get<EventListResponse>(`/v1/events?page=${page}&page_size=${pageSize}`);
  },

  async getById(id: string) {
    return api.get<EventListResponse["events"][0]>(`/v1/events/${id}`);
  },
};