import { Event } from "@/types";

export interface EventListResponse {
  events: Event[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}