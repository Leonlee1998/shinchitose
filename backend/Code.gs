/**
 * Shinchitose Project Management - Google Apps Script Backend
 * 
 * This script provides a RESTful API for managing project data in Google Sheets
 * Deploy as Web App: Execute as "Me", Access "Anyone"
 */

// Configuration - Set your Spreadsheet ID here
const SPREADSHEET_ID = '1QJ2wDa8zJVNsCKLbGL8LAAXWYW6bbXCH8BnfN4lJxu4'; // Replace with your actual Spreadsheet ID
const API_KEY = 'YOUR_API_KEY'; // Optional: Add your own API key for security

// Sheet names matching the data types
const SHEET_NAMES = {
  projects: 'Projects',
  tasks: 'Tasks',
  meetings: 'Meetings',
  documents: 'Documents',
  socialContents: 'SocialContents',
  users: 'Users'
};

/**
 * Handle GET requests - Read data
 */
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    const type = params.type;
    const apiKey = params.apiKey;

    // Optional: API key validation
    // if (API_KEY && apiKey !== API_KEY) {
    //   return createResponse({ error: 'Unauthorized' }, 401);
    // }

    if (action === 'getAll') {
      const data = getAllData(type);
      return createResponse({ success: true, data: data });
    }

    if (action === 'getById') {
      const id = params.id;
      const data = getDataById(type, id);
      return createResponse({ success: true, data: data });
    }

    return createResponse({ error: 'Invalid action' }, 400);
  } catch (error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Handle POST requests - Create, Update, Delete data
 */
function doPost(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    const type = params.type;
    const apiKey = params.apiKey;

    // Optional: API key validation
    // if (API_KEY && apiKey !== API_KEY) {
    //   return createResponse({ error: 'Unauthorized' }, 401);
    // }

    let data = null;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    if (action === 'create') {
      const newId = createData(type, data);
      return createResponse({ success: true, id: newId, data: data });
    }

    if (action === 'update') {
      const id = params.id;
      updateData(type, id, data);
      return createResponse({ success: true, id: id, data: data });
    }

    if (action === 'delete') {
      const id = params.id;
      deleteData(type, id);
      return createResponse({ success: true, id: id });
    }

    if (action === 'bulkLoad') {
      // Load all data at once
      const allData = {
        projects: getAllData('projects'),
        tasks: getAllData('tasks'),
        meetings: getAllData('meetings'),
        documents: getAllData('documents'),
        socialContents: getAllData('socialContents'),
        users: getAllData('users')
      };
      return createResponse({ success: true, data: allData });
    }

    return createResponse({ error: 'Invalid action' }, 400);
  } catch (error) {
    return createResponse({ error: error.toString() }, 500);
  }
}

/**
 * Get all data from a specific sheet
 */
function getAllData(type) {
  const sheetName = SHEET_NAMES[type];
  if (!sheetName) {
    throw new Error('Invalid data type: ' + type);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // If sheet doesn't exist, return empty array
    return [];
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return []; // No data (only headers or empty)
  }

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      const value = row[index];
      // Try to parse JSON strings (for arrays and objects)
      if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
        try {
          obj[header] = JSON.parse(value);
        } catch (e) {
          obj[header] = value;
        }
      } else {
        obj[header] = value;
      }
    });
    return obj;
  });
}

/**
 * Get data by ID
 */
function getDataById(type, id) {
  const allData = getAllData(type);
  return allData.find(item => item.id === id);
}

/**
 * Create new data entry
 */
function createData(type, data) {
  const sheetName = SHEET_NAMES[type];
  if (!sheetName) {
    throw new Error('Invalid data type: ' + type);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Add headers based on data keys
    const headers = Object.keys(data);
    sheet.appendRow(headers);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = headers.map(header => {
    const value = data[header];
    // Stringify arrays and objects
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value || '';
  });

  sheet.appendRow(rowData);
  return data.id;
}

/**
 * Update existing data entry
 */
function updateData(type, id, data) {
  const sheetName = SHEET_NAMES[type];
  if (!sheetName) {
    throw new Error('Invalid data type: ' + type);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idColumnIndex = headers.indexOf('id');

  if (idColumnIndex === -1) {
    throw new Error('ID column not found');
  }

  // Find the row with matching ID
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idColumnIndex] === id) {
      // Update the row
      const rowData = headers.map(header => {
        const value = data[header];
        // Stringify arrays and objects
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return value !== undefined ? value : allData[i][headers.indexOf(header)];
      });

      sheet.getRange(i + 1, 1, 1, headers.length).setValues([rowData]);
      return;
    }
  }

  throw new Error('Data not found with id: ' + id);
}

/**
 * Delete data entry
 */
function deleteData(type, id) {
  const sheetName = SHEET_NAMES[type];
  if (!sheetName) {
    throw new Error('Invalid data type: ' + type);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }

  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idColumnIndex = headers.indexOf('id');

  if (idColumnIndex === -1) {
    throw new Error('ID column not found');
  }

  // Find and delete the row with matching ID
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idColumnIndex] === id) {
      sheet.deleteRow(i + 1);
      return;
    }
  }

  throw new Error('Data not found with id: ' + id);
}

/**
 * Create JSON response
 */
function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);

  // Note: Google Apps Script doesn't support custom status codes in Web Apps
  // All responses return 200, but we include status in the response body
  if (statusCode !== 200) {
    data.statusCode = statusCode;
  }

  return output;
}
