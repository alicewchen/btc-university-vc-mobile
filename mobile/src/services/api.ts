import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { DAO, Publication, Course, GovernanceProposal, Milestone } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// DAO Services
export const daoService = {
  getAll: async (): Promise<DAO[]> => {
    const response = await api.get(API_ENDPOINTS.DAOS);
    return response.data;
  },

  getById: async (id: string): Promise<DAO> => {
    const response = await api.get(API_ENDPOINTS.DAO_BY_ID(id));
    return response.data;
  },

  search: async (query: string, filters?: any): Promise<DAO[]> => {
    const response = await api.get(API_ENDPOINTS.DAOS, {
      params: { search: query, ...filters },
    });
    return response.data;
  },
};

// Publication Services
export const publicationService = {
  getByDaoId: async (daoId: string): Promise<Publication[]> => {
    const response = await api.get(API_ENDPOINTS.PUBLICATIONS(daoId));
    return response.data;
  },
};

// Course Services
export const courseService = {
  getByDaoId: async (daoId: string): Promise<Course[]> => {
    const response = await api.get(API_ENDPOINTS.COURSES(daoId));
    return response.data;
  },
};

// Governance Services
export const governanceService = {
  getProposals: async (daoId: string): Promise<GovernanceProposal[]> => {
    const response = await api.get(API_ENDPOINTS.PROPOSALS(daoId));
    return response.data;
  },
};

// Milestone Services
export const milestoneService = {
  getByDaoId: async (daoId: string): Promise<Milestone[]> => {
    const response = await api.get(API_ENDPOINTS.MILESTONES(daoId));
    return response.data;
  },
};

// Chat/Search Services
export const chatService = {
  sendMessage: async (message: string, context?: any) => {
    const response = await api.post(API_ENDPOINTS.CHAT, {
      message,
      context,
    });
    return response.data;
  },
};

// Smart Contract Services
export const contractService = {
  createDAO: async (formData: any) => {
    const response = await api.post(API_ENDPOINTS.CREATE_DAO, formData);
    return response.data;
  },
};

export default api;
