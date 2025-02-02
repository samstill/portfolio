export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  imageUrl?: string;
  totalTickets: number;
  availableTickets: number;
  soldTickets: number;
  createdAt?: any;
  lastUpdated?: any;
}

export interface EventFilters {
  searchTerm?: string;
  startDate?: Date;
  endDate?: Date;
  minPrice?: number;
  maxPrice?: number;
}