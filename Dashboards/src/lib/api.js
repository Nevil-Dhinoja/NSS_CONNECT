// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  PASSWORD: `${API_BASE_URL}/auth/password`,
  USERS: (role) => `${API_BASE_URL}/auth/users/${role}`,
  ADD_STUDENT_COORDINATOR: `${API_BASE_URL}/auth/add-student-coordinator`,
  UPDATE_STUDENT_COORDINATOR: (id) => `${API_BASE_URL}/auth/student-coordinator/${id}`,
  DELETE_STUDENT_COORDINATOR: (id) => `${API_BASE_URL}/auth/student-coordinator/${id}`,
  ADD_PROGRAM_OFFICER: `${API_BASE_URL}/auth/users/program-officer`,
  UPDATE_PROGRAM_OFFICER: (id) => `${API_BASE_URL}/auth/users/program-officer/${id}`,
  DELETE_PROGRAM_OFFICER: (id) => `${API_BASE_URL}/auth/users/program-officer/${id}`,
  INSTITUTES: `${API_BASE_URL}/auth/institutes`,
  DEPARTMENTS: (instituteId) => `${API_BASE_URL}/auth/departments/${instituteId}`,

  // Working hours endpoints
  WORKING_HOURS_ALL: `${API_BASE_URL}/working-hours/all`,
  WORKING_HOURS_MY: `${API_BASE_URL}/working-hours/my-hours`,
  WORKING_HOURS_DEPARTMENT: (dept) => `${API_BASE_URL}/working-hours/department/${dept}`,
  WORKING_HOURS_ADD: `${API_BASE_URL}/working-hours/addWorkingHours`,
  WORKING_HOURS_UPDATE: (id) => `${API_BASE_URL}/working-hours/update/${id}`,
  WORKING_HOURS_DELETE: (id) => `${API_BASE_URL}/working-hours/delete/${id}`,
  WORKING_HOURS_APPROVE: (id) => `${API_BASE_URL}/working-hours/approve/${id}`,
  WORKING_HOURS_REJECT: (id) => `${API_BASE_URL}/working-hours/reject/${id}`,

  // Events endpoints
  EVENTS_ALL: `${API_BASE_URL}/events/all`,
  EVENTS_DEPARTMENT: (dept) => `${API_BASE_URL}/events/department/${encodeURIComponent(dept)}`,
  EVENTS_ADD: `${API_BASE_URL}/events/add`,
  EVENTS_PC_ADD: `${API_BASE_URL}/events/pc/add`,
  EVENTS_UPDATE: (id) => `${API_BASE_URL}/events/update/${id}`,
  EVENTS_DELETE: (id) => `${API_BASE_URL}/events/delete/${id}`,
  EVENTS_PC_DELETE: (id) => `${API_BASE_URL}/events/pc/delete/${id}`,
  EVENTS_TEST: `${API_BASE_URL}/events/test`,
  EVENTS_UPDATE_STATUSES: `${API_BASE_URL}/events/update-statuses`,

  // Reports endpoints
  REPORTS_ALL: `${API_BASE_URL}/events/reports`,
  REPORTS_STATUS: (id) => `${API_BASE_URL}/events/reports/${id}/status`,
  REPORTS_DOWNLOAD: (id) => `${API_BASE_URL}/events/reports/${id}/download`,
  REPORTS_DELETE: (id) => `${API_BASE_URL}/events/reports/${id}`,
  REPORTS_TEMPLATE: `${API_BASE_URL}/events/reports/template/download`,
  REPORTS_SUBMIT: `${API_BASE_URL}/events/submit-report`,

  // Volunteers endpoints
  VOLUNTEERS_ALL: `${API_BASE_URL}/volunteers/all`,
  VOLUNTEERS_DEPARTMENT: (dept) => `${API_BASE_URL}/volunteers/department/${dept}`,
  VOLUNTEERS_DEPARTMENTS: `${API_BASE_URL}/volunteers/departments`,
  VOLUNTEERS_ADD: `${API_BASE_URL}/volunteers/addVolunteer`,
  VOLUNTEERS_UPDATE: (id) => `${API_BASE_URL}/volunteers/edit/${id}`,
  VOLUNTEERS_DELETE: (id) => `${API_BASE_URL}/volunteers/delete/${id}`,
  VOLUNTEERS_UPLOAD: `${API_BASE_URL}/volunteers/upload`,
};

// Helper function to get API URL
export const getApiUrl = (endpoint) => {
  return endpoint;
};

// Helper function to make authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("nssUserToken");
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(endpoint, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
};

export default API_ENDPOINTS; 