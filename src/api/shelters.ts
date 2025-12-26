import {
  getStoredAccessToken,
  getStoredRefreshToken,
  storeAuthTokens,
} from '../storage/tokenStorage';
import { refreshAuthToken } from './auth';

const API_BASE_URL = 'https://dev.puppydoc.ovh';

export interface ShelterSearchParams {
  location?: string;
  lat?: number;
  lng?: number;
  radius_km?: number;
  sort_by?: 'distance' | 'rating' | 'review_count';
  limit?: number;
  offset?: number;
}

export interface ShelterListItem {
  shelter_id: number;
  name: string;
  address: string;
  phone_number?: string;
  location?: { lat: number; lng: number };
  distance_m?: number;
  rating?: number;
  review_count?: number;
  website_url?: string;
  place_url?: string;
  open_now?: boolean;
}

export interface ShelterSearchResponse {
  center?: { lat: number; lng: number };
  radius_km?: number;
  sort_by?: string;
  total?: number;
  items: ShelterListItem[];
  page?: { limit: number; offset: number };
}

export interface ShelterDetail {
  shelter_id: number;
  name: string;
  address: string;
  phone_number?: string;
  operating_hours?: string;
  introduction?: string;
  latitude?: number;
  longitude?: number;
  website_url?: string;
  contact_email?: string;
  rating?: number;
  review_count?: number;
}

export interface PetDetail {
  pet_id: number;
  shelter_id: number;
  name: string;
  species: string;
  breed?: string;
  gender?: string;
  age?: string;
  is_neutered?: boolean;
  adoption_status?: string;
  description?: string;
  images?: string[];
  created_at?: string;
  updated_at?: string;
  share_url?: string;
  shelter_contact?: {
    name?: string;
    phone_number?: string;
    address?: string;
    website_url?: string;
  };
}

const parseJsonSafe = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const readErrorBody = async (response: Response) => {
  try {
    return await response.text();
  } catch {
    return '';
  }
};

const buildAuthHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: 'application/json',
});

const authorizedFetch = async (input: string, init?: RequestInit): Promise<Response> => {
  let accessToken = await getStoredAccessToken();
  if (!accessToken) {
    throw new Error('로그인이 필요합니다. 다시 로그인해 주세요.');
  }

  const doFetch = (token: string) =>
    fetch(input, {
      ...(init || {}),
      headers: {
        ...(init?.headers || {}),
        ...buildAuthHeaders(token),
      },
    });

  // First attempt
  let response = await doFetch(accessToken);
  console.log('[shelters] fetch status', response.status);
  if (response.status !== 401 && response.status !== 403) {
    return response;
  }

  // Try refresh once
  const refreshToken = await getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error('세션이 만료되었습니다. 다시 로그인해 주세요.');
  }
  try {
    const newTokens = await refreshAuthToken(refreshToken);
    await storeAuthTokens(newTokens);
    accessToken = newTokens.accessToken;
    console.log('[shelters] token refreshed');
    response = await doFetch(accessToken);
  } catch (err) {
    console.warn('[shelters] token refresh 실패', err);
    throw new Error('세션이 만료되었습니다. 다시 로그인해 주세요.');
  }

  if (response.status === 401 || response.status === 403) {
    console.log('[shelters] still unauthorized after refresh', response.status);
    throw new Error('세션이 만료되었습니다. 다시 로그인해 주세요.');
  }

  return response;
};

export const searchShelters = async (
  params: ShelterSearchParams
): Promise<ShelterSearchResponse> => {
  const query = new URLSearchParams();
  if (params.location) query.append('location', params.location);
  if (params.lat !== undefined) query.append('lat', String(params.lat));
  if (params.lng !== undefined) query.append('lng', String(params.lng));
  if (params.radius_km !== undefined) query.append('radius_km', String(params.radius_km));
  if (params.sort_by) query.append('sort_by', params.sort_by);
  if (params.limit !== undefined) query.append('limit', String(params.limit));
  if (params.offset !== undefined) query.append('offset', String(params.offset));

  const url = `${API_BASE_URL}/api/shelters/search${query.toString() ? `?${query.toString()}` : ''}`;

  const response = await authorizedFetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await readErrorBody(response);
    if (errorText) console.log('[shelters] search error body', errorText);
    const data = await parseJsonSafe(response);
    const message =
      data?.message ||
      errorText ||
      `보호소 목록을 불러오지 못했습니다. (HTTP ${response.status})`;
    throw new Error(message);
  }

  const data = await parseJsonSafe(response);
  return (data as ShelterSearchResponse) ?? { items: [] };
};

export const getShelterDetail = async (shelterId: number): Promise<ShelterDetail> => {
  const response = await authorizedFetch(`${API_BASE_URL}/api/shelters/${shelterId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await readErrorBody(response);
    if (errorText) console.log('[shelters] detail error body', errorText);
    const data = await parseJsonSafe(response);
    const message =
      data?.message ||
      errorText ||
      `보호소 정보를 불러오지 못했습니다. (HTTP ${response.status})`;
    throw new Error(message);
  }

  const data = await parseJsonSafe(response);
  return (data as { shelter: ShelterDetail })?.shelter ?? ({} as ShelterDetail);
};

export const getShelterPetDetail = async (
  shelterId: number,
  petId: number
): Promise<PetDetail> => {
  const response = await authorizedFetch(
    `${API_BASE_URL}/api/shelters/${shelterId}/pets/${petId}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    const errorText = await readErrorBody(response);
    if (errorText) console.log('[shelters] pet detail error body', errorText);
    const data = await parseJsonSafe(response);
    const message =
      data?.message ||
      errorText ||
      `입양 가능 동물 정보를 불러오지 못했습니다. (HTTP ${response.status})`;
    throw new Error(message);
  }

  const data = await parseJsonSafe(response);
  return (data as { pet: PetDetail })?.pet ?? ({} as PetDetail);
};

