import apiService from "./apiService";

const RESOURCE = "policies";

/**
 * Get all policies
 * @returns {Promise<Array>} Array of policies
 */
export const getPolicies = (pageNumber = 1, pageSize = 10, sortBy = "name", filters = {}) => {
    return apiService.getList(RESOURCE, { pageNumber, pageSize, sortBy, filters });
};

/**
 * Get a policy by name
 * @param {string} name - Policy name
 * @returns {Promise<Object>} Policy object
 */
export const getPolicyByName = (name) => apiService.getById(RESOURCE, name);

/**
 * Create a new policy
 * @param {Object} policyData - Policy data
 * @returns {Promise<Object>} Created policy
 */
export const createPolicy = (policyData) => apiService.create(RESOURCE, policyData);

/**
 * Update an existing policy
 * @param {string} name - Policy name
 * @param {Object} policyData - Updated policy data
 * @returns {Promise<Object>} Updated policy
 */
export const updatePolicy = (name, policyData) => apiService.update(RESOURCE, name, policyData);

/**
 * Delete a policy
 * @param {string} name - Policy name
 * @returns {Promise<boolean>} Success status
 */
export const deletePolicy = (name) => apiService.delete(RESOURCE, name);

/**
 * Export policies data
 * @param {string} format - Export format (csv, json)
 * @param {Object} filters - Filter criteria
 * @param {string} sortBy - Field to sort by
 * @returns {Promise<Blob>} Exported data as blob
 */
export const exportPolicies = (format = 'csv', filters = {}, sortBy = "name") => {
    return apiService.export(RESOURCE, { format, filters, sortBy });
};
