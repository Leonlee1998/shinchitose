
import { AppState, Project, Task, Meeting, Document, SocialContent, User } from '../types';
import { config } from '../config';

const API_URL = config.GOOGLE_APPS_SCRIPT_URL;
const API_KEY = config.API_KEY;
const USE_API_KEY = config.USE_API_KEY;

/**
 * Build URL with API key if enabled
 */
function buildUrl(baseUrl: string, params: Record<string, string> = {}): string {
  const url = new URL(baseUrl);

  // Add API key if enabled
  if (USE_API_KEY && API_KEY) {
    params.apiKey = API_KEY;
  }

  // Add all parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
}

/**
 * Make API request with error handling
 * Note: We avoid setting Content-Type to prevent CORS preflight requests
 */
async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
  try {
    // Remove Content-Type header to avoid CORS preflight
    const response = await fetch(url, {
      ...options,
      // Don't set headers to avoid CORS preflight
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export const dataService = {
  /**
   * Load all data from Google Sheets
   */
  loadData: async (): Promise<AppState> => {
    if (!API_URL) {
      console.warn('Google Apps Script URL not configured, using mock data');
      return getMockData();
    }

    try {
      const url = buildUrl(API_URL, { action: 'bulkLoad' });
      const result = await apiRequest(url, { method: 'POST' });

      return {
        projects: result.data.projects || [],
        tasks: result.data.tasks || [],
        meetings: result.data.meetings || [],
        documents: result.data.documents || [],
        socialContents: result.data.socialContents || [],
        currentUser: null, // User management handled separately
      };
    } catch (error) {
      console.error('Failed to load data from Google Sheets:', error);
      // Fallback to mock data on error
      return getMockData();
    }
  },

  /**
   * Create a new project
   */
  createProject: async (project: Project): Promise<void> => {
    if (!API_URL) {
      console.warn('Google Apps Script URL not configured');
      return;
    }

    const url = buildUrl(API_URL, { action: 'create', type: 'projects' });

    // Use FormData to avoid CORS preflight
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(project));

    await apiRequest(url, {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Update an existing project
   */
  updateProject: async (id: string, project: Partial<Project>): Promise<void> => {
    if (!API_URL) {
      console.warn('Google Apps Script URL not configured');
      return;
    }

    const url = buildUrl(API_URL, { action: 'update', type: 'projects', id });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  /**
   * Delete a project
   */
  deleteProject: async (id: string): Promise<void> => {
    if (!API_URL) {
      console.warn('Google Apps Script URL not configured');
      return;
    }

    const url = buildUrl(API_URL, { action: 'delete', type: 'projects', id });
    await apiRequest(url, { method: 'POST' });
  },

  /**
   * Create a new task
   */
  createTask: async (task: Task): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'create', type: 'tasks' });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  /**
   * Update an existing task
   */
  updateTask: async (id: string, task: Partial<Task>): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'update', type: 'tasks', id });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'delete', type: 'tasks', id });
    await apiRequest(url, { method: 'POST' });
  },

  /**
   * Create a new meeting
   */
  createMeeting: async (meeting: Meeting): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'create', type: 'meetings' });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(meeting),
    });
  },

  /**
   * Update an existing meeting
   */
  updateMeeting: async (id: string, meeting: Partial<Meeting>): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'update', type: 'meetings', id });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(meeting),
    });
  },

  /**
   * Delete a meeting
   */
  deleteMeeting: async (id: string): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'delete', type: 'meetings', id });
    await apiRequest(url, { method: 'POST' });
  },

  /**
   * Create a new document
   */
  createDocument: async (document: Document): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'create', type: 'documents' });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(document),
    });
  },

  /**
   * Update an existing document
   */
  updateDocument: async (id: string, document: Partial<Document>): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'update', type: 'documents', id });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(document),
    });
  },

  /**
   * Delete a document
   */
  deleteDocument: async (id: string): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'delete', type: 'documents', id });
    await apiRequest(url, { method: 'POST' });
  },

  /**
   * Create a new social content
   */
  createSocialContent: async (content: SocialContent): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'create', type: 'socialContents' });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(content),
    });
  },

  /**
   * Update an existing social content
   */
  updateSocialContent: async (id: string, content: Partial<SocialContent>): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'update', type: 'socialContents', id });
    await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(content),
    });
  },

  /**
   * Delete a social content
   */
  deleteSocialContent: async (id: string): Promise<void> => {
    if (!API_URL) return;

    const url = buildUrl(API_URL, { action: 'delete', type: 'socialContents', id });
    await apiRequest(url, { method: 'POST' });
  },
};

/**
 * Mock data for fallback when API is not configured
 */
function getMockData(): AppState {
  return {
    projects: [],
    tasks: [],
    meetings: [],
    documents: [],
    socialContents: [],
    currentUser: null,
  };
}
