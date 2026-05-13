export interface Event {
  public_id: string;
  name: string;
  description: string;
  short_description: string;
  start_date: string;
  end_date: string;
  location: string;
  venue_details: string;
  image_url: string;
  slug?: string;
  is_active: boolean;
  is_published: boolean;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

export interface OrderResponse {
  publicId: string;
  status: string;
  totalAmount: number;
  currency: string;
  tickets: any[];
}

export interface PaymentResponse {
  paymentId: string;
  status: string;
  requiresAction: boolean;
  providerInstructions: {
    client_secret: string;
    payment_intent_id: string;
  };
}