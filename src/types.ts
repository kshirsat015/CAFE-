/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'House Bakes' | 'Coffees' | 'Appetizers' | 'Pizzas' | 'Mains' | 'Salads & Sushi' | 'Desserts';
  dietary: string[];
  image: string;
  options?: {
    name: string;
    required: boolean;
    choices: string[];
  }[];
}

export interface CartItem {
  id: string; // Dynamic unique ID for this cart instance
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: { [optionName: string]: string };
}

export interface ReservationState {
  partySize: number;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export interface CRMPayload {
  transactionType: 'RESERVATION' | 'ORDER';
  timestamp: string; // ISO String format
  payload: {
    guestDetails?: {
      name: string;
      email: string;
      phone: string;
      notes?: string;
    };
    bookingDetails?: {
      partySize: number;
      date: string;
      timeSlot: string;
    };
    orderItems?: Array<{
      id: string;
      quantity: number;
      selections: string[];
    }>;
    financials?: {
      subtotal: number;
      tax: number;
      total: number;
    };
  };
}
