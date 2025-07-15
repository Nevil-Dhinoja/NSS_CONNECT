import * as XLSX from "xlsx";

/**
 * Export data to Excel with filtering support
 * @param {Array} data - The data to export
 * @param {string} filename - The filename for the Excel file
 * @param {Object} filters - Current filters applied (optional)
 * @param {string} sheetName - Name of the worksheet (default: "Data")
 * @param {Array} columns - Column configuration for export
 */
export const exportToExcel = (data, filename, filters = {}, sheetName = "Data", columns = null) => {
  try {
    // If no columns specified, use all data properties
    let exportData = data;
    
    if (columns) {
      // Map data to specified columns
      exportData = data.map(item => {
        const mappedItem = {};
        columns.forEach(col => {
          if (col.key && item[col.key] !== undefined) {
            mappedItem[col.label] = item[col.key];
          }
        });
        return mappedItem;
      });
    }

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Auto-size columns
    const columnWidths = {};
    exportData.forEach(row => {
      Object.keys(row).forEach(key => {
        const length = Math.max(key.length, String(row[key]).length);
        columnWidths[key] = Math.max(columnWidths[key] || 0, length);
      });
    });
    
    worksheet['!cols'] = Object.keys(columnWidths).map(key => ({
      width: Math.min(Math.max(columnWidths[key] + 2, 10), 50)
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Add filters info to a separate sheet if filters are applied
    if (Object.keys(filters).length > 0) {
      const filterData = Object.entries(filters).map(([key, value]) => ({
        Filter: key,
        Value: value
      }));
      
      const filterWorksheet = XLSX.utils.json_to_sheet(filterData);
      XLSX.utils.book_append_sheet(workbook, filterWorksheet, "Filters");
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const finalFilename = `${filename}_${timestamp}.xlsx`;

    // Write and download using native browser approach
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename: finalFilename };
  } catch (error) {
    // Excel export error occurred
    throw new Error('Failed to export data to Excel');
  }
};

/**
 * Export events data with specific formatting
 */
export const exportEventsToExcel = (events, filters = {}) => {
  const columns = [
    { key: 'event_name', label: 'Event Name' },
    { key: 'event_date', label: 'Event Date' },
    { key: 'event_mode', label: 'Event Mode' },
    { key: 'department_name', label: 'Department' },
    { key: 'status', label: 'Status' },
    { key: 'description', label: 'Description' },
    { key: 'created_by_name', label: 'Created By' }
  ];

  // Format the data
  const formattedData = events.map(event => ({
    ...event,
    event_date: event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A',
    event_mode: event.event_mode ? event.event_mode.charAt(0).toUpperCase() + event.event_mode.slice(1) : 'N/A',
    status: event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'N/A'
  }));

  return exportToExcel(formattedData, 'NSS_Events', filters, 'Events', columns);
};

/**
 * Export volunteers data with specific formatting
 */
export const exportVolunteersToExcel = (volunteers, filters = {}) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'adhar_no', label: 'Adhar No' },
    { key: 'gender', label: 'Gender' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'department', label: 'Department' },
    { key: 'year', label: 'Year' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Phone' }
  ];

  // Format the data
  const formattedData = volunteers.map(volunteer => ({
    ...volunteer,
    dob: volunteer.dob ? new Date(volunteer.dob).toLocaleDateString() : 'N/A'
  }));

  return exportToExcel(formattedData, 'NSS_Volunteers', filters, 'Volunteers', columns);
};

/**
 * Export working hours data with specific formatting
 */
export const exportWorkingHoursToExcel = (workingHours, filters = {}) => {
  const columns = [
    { key: 'activity_name', label: 'Activity' },
    { key: 'date', label: 'Date' },
    { key: 'start_time', label: 'Start Time' },
    { key: 'end_time', label: 'End Time' },
    { key: 'hours', label: 'Hours' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
  ];

  // Format the data
  const formattedData = workingHours.map(entry => ({
    ...entry,
    date: entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A',
    status: entry.status ? entry.status.charAt(0).toUpperCase() + entry.status.slice(1) : 'N/A'
  }));

  return exportToExcel(formattedData, 'NSS_Working_Hours', filters, 'Working Hours', columns);
};

/**
 * Export reports data with specific formatting
 */
export const exportReportsToExcel = (reports, filters = {}) => {
  const columns = [
    { key: 'event_name', label: 'Event Name' },
    { key: 'event_date', label: 'Event Date' },
    { key: 'department_name', label: 'Department' },
    { key: 'submitted_by_name', label: 'Submitted By' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Submitted On' }
  ];

  // Format the data
  const formattedData = reports.map(report => ({
    ...report,
    event_date: report.event_date ? new Date(report.event_date).toLocaleDateString() : 'N/A',
    created_at: report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A',
    status: report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'N/A'
  }));

  return exportToExcel(formattedData, 'NSS_Reports', filters, 'Reports', columns);
};

/**
 * Export student leaders data with specific formatting
 */
export const exportStudentLeadersToExcel = (leaders, filters = {}) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'student_id', label: 'Student ID' },
    { key: 'department', label: 'Department' },
    { key: 'year', label: 'Year' },
    { key: 'email', label: 'Email' },
    { key: 'contact', label: 'Phone' },
    { key: 'role', label: 'Role' }
  ];

  // Format the data
  const formattedData = leaders.map(leader => ({
    ...leader
  }));

  return exportToExcel(formattedData, 'NSS_Student_Leaders', filters, 'Student Leaders', columns);
};

/**
 * Export program officers data with specific formatting
 */
export const exportProgramOfficersToExcel = (officers, filters = {}) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
    { key: 'contact', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'joined_on', label: 'Joined On' }
  ];

  // Format the data
  const formattedData = officers.map(officer => ({
    ...officer,
    joined_on: officer.joined_on ? new Date(officer.joined_on).toLocaleDateString() : 'N/A'
  }));

  return exportToExcel(formattedData, 'NSS_Program_Officers', filters, 'Program Officers', columns);
}; 