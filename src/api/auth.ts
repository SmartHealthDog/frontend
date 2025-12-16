import { Platform } from 'react-native';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export interface RegisterUserPayload {
  email: string;
  password: string;
  nickname: string;
  emailVerificationToken: string;
  profilePictureUri?: string | null;
}

class ApiError extends Error {
  status: number;
  codes: string[];

  constructor(message: string, status: number, codes: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.codes = codes;
  }
}

const API_BASE_URL = 'https://dev.puppydoc.ovh';

const parseErrorResponse = async (response: Response) => {
  const fallbackMessage = `요청을 처리하지 못했습니다. (HTTP ${response.status})`;
  let bodyText = '';

  try {
    bodyText = await response.text();
  } catch {
    return { message: fallbackMessage, codes: [] as string[] };
  }

  if (!bodyText) {
    return { message: fallbackMessage, codes: [] as string[] };
  }

  try {
    const parsed = JSON.parse(bodyText);
    const codes = Array.isArray(parsed.code) ? parsed.code : [];
    if (Array.isArray(parsed.descriptions) && parsed.descriptions.length > 0) {
      return { message: parsed.descriptions.join('\n'), codes };
    }
    if (typeof parsed.message === 'string') {
      return { message: parsed.message, codes };
    }
    if (codes.length > 0) {
      return { message: codes.join(', '), codes };
    }
    return { message: fallbackMessage, codes: [] as string[] };
  } catch {
    return { message: bodyText || fallbackMessage, codes: [] as string[] };
  }
};

const getMimeTypeFromUri = (uri: string) => {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  return 'image/*';
};

const normalizeFileName = (uri: string) => {
  const segments = uri.split('/');
  const lastSegment = segments[segments.length - 1];
  if (lastSegment && lastSegment.includes('.')) {
    return lastSegment;
  }
  const extension = Platform.OS === 'ios' ? 'jpg' : 'jpeg';
  return `profile.${extension}`;
};

export const sendEmailVerification = async (email: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register/send-email-verification`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  );

  if (response.status !== 201) {
    const { message, codes } = await parseErrorResponse(response);
    throw new ApiError(message, response.status, codes);
  }
};

export const registerUser = async ({
  email,
  password,
  nickname,
  emailVerificationToken,
  profilePictureUri,
}: RegisterUserPayload) => {
  console.log('[auth] registerUser 요청', {
    email,
    nickname,
    hasProfilePicture: Boolean(profilePictureUri),
  });

  const formData = new FormData();
  const jsonPayload = {
    email,
    password,
    nickname,
    emailVerificationToken,
  };
  formData.append('request', JSON.stringify(jsonPayload));

  if (profilePictureUri) {
    formData.append('profilePicture', {
      uri: profilePictureUri,
      type: getMimeTypeFromUri(profilePictureUri),
      name: normalizeFileName(profilePictureUri),
    } as any);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('[auth] registerUser 네트워크 오류', error);
    throw error;
  }

  console.log('[auth] registerUser 응답 상태', response.status);

  if (response.status !== 201) {
    const errorBody = await response.clone().text().catch(() => '');
    if (errorBody) {
      console.log('[auth] registerUser 실패 응답 본문', errorBody);
    }
    const { message, codes } = await parseErrorResponse(response);
    throw new ApiError(message, response.status, codes);
  }

  console.log('[auth] registerUser 성공');
};

export const login = async (
  email: string,
  password: string
): Promise<AuthTokens> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const { message, codes } = await parseErrorResponse(response);
    throw new ApiError(message, response.status, codes);
  }

  return response.json();
};

export const refreshAuthToken = async (
  refreshToken: string
): Promise<AuthTokens> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const { message, codes } = await parseErrorResponse(response);
    throw new ApiError(message, response.status, codes);
  }

  return response.json();
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

