import apiService from "./apiService";

const RESOURCE = "inventory-categories";

export const getInventoryCategories = () => apiService.getAll(RESOURCE);
export const getInventoryCategoryById = (id) => apiService.getById(RESOURCE, id);
export const createInventoryCategory = (categoryData) => apiService.create(RESOURCE, categoryData);
export const updateInventoryCategory = (id, categoryData) => apiService.update(RESOURCE, id, categoryData);
export const deleteInventoryCategory = (id) => apiService.delete(RESOURCE, id);
