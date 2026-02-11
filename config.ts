/// <reference types="vite/client" />

/**
 * Configuration for Shinchitose Project Management
 */

export const config = {
    // Google Apps Script Web App URL
    // Get this URL after deploying your Apps Script as a Web App
    GOOGLE_APPS_SCRIPT_URL: import.meta.env.VITE_APPS_SCRIPT_URL || '',

    // Optional API Key for additional security
    API_KEY: import.meta.env.VITE_API_KEY || '',

    // Enable/disable API key in requests
    USE_API_KEY: import.meta.env.VITE_USE_API_KEY === 'true',
};
