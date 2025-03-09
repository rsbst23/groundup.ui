import apiService from "./apiService";
import dayjs from "dayjs";

const RESOURCE = "inventory-categories";

export const getInventoryCategories = (pageNumber = 1, pageSize = 10, sortBy = "name", filters = {}) => {
    return apiService.getList(RESOURCE, { pageNumber, pageSize, sortBy, filters });
};

export const getInventoryCategoryById = (id) => apiService.getById(RESOURCE, id);
export const createInventoryCategory = (categoryData) => apiService.create(RESOURCE, categoryData);
export const updateInventoryCategory = (id, categoryData) => apiService.update(RESOURCE, id, categoryData);
export const deleteInventoryCategory = (id) => apiService.delete(RESOURCE, id);

export const exportInventoryCategories = (format = 'csv', filters = {}, sortBy = "name") => {
    return apiService.export(RESOURCE, { format, filters, sortBy });
};