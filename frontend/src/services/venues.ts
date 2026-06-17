import api from './api';

export interface Venue {
  _id: string;
  name: string;
  area: string;
  city: string;
  state?: string;
  address?: string;
  pincode?: string;
}

export const venueService = {
  async getMyVenues() {
    const res = (await api.get('/venues/my')) as { venues: Venue[] };
    return res.venues ?? [];
  },

  async createVenue(payload: {
    name: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    address: string;
  }) {
    const res = (await api.post('/venues', payload)) as { venue: Venue };
    return res.venue;
  },

  async getAllVenues() {
    const res = (await api.get('/venues')) as { venues: Venue[] };
    return res.venues ?? [];
  },
};
