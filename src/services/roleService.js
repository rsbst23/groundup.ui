import apiService from "./apiService";

const RESOURCE = "roles";

/**
 * Get all roles
 * @returns {Promise<Array>} Array of roles
 */
export const getRoles = (pageNumber = 1, pageSize = 10, sortBy = "name", filters = {}) => {
    return apiService.getList(RESOURCE, { pageNumber, pageSize, sortBy, filters });
};

/**
 * Get a role by name
 * @param {string} name - Role name
 * @returns {Promise<Object>} Role object
 */
export const getRoleByName = (name) => apiService.getById(RESOURCE, name);

/**
 * Create a new role
 * @param {Object} roleData - Role data
 * @returns {Promise<Object>} Created role
 */
export const createRole = (roleData) => apiService.create(RESOURCE, roleData);

/**
 * Update an existing role
 * @param {string} name - Role name
 * @param {Object} roleData - Updated role data
 * @returns {Promise<Object>} Updated role
 */
export const updateRole = (name, roleData) => apiService.update(RESOURCE, name, roleData);

/**
 * Delete a role
 * @param {string} name - Role name
 * @returns {Promise<boolean>} Success status
 */
export const deleteRole = (name) => apiService.delete(RESOURCE, name);

/**
 * Export roles data
 * @param {string} format - Export format (csv, json)
 * @param {Object} filters - Filter criteria
 * @param {string} sortBy - Field to sort by
 * @returns {Promise<Blob>} Exported data as blob
 */
export const exportRoles = (format = 'csv', filters = {}, sortBy = "name") => {
    return apiService.export(RESOURCE, { format, filters, sortBy });
};