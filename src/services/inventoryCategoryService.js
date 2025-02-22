import apiService from "./apiService";
import dayjs from "dayjs";

const RESOURCE = "inventory-categories";

export const getInventoryCategories = (pageNumber = 1, pageSize = 10, sortBy = "Name", filters = {}) => {
    let query = `pageNumber=${pageNumber}&pageSize=${pageSize}&SortBy=${sortBy}`;

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            if (key.startsWith("MinFilters") || key.startsWith("MaxFilters")) {
                query += `&${key}=${encodeURIComponent(value)}`;
            } else {
                query += `&ContainsFilters[${key}]=${encodeURIComponent(value)}`;
            }
        }
    });

    return apiService.getAll(`${RESOURCE}?${query}`);
};

export const getInventoryCategoryById = (id) => apiService.getById(RESOURCE, id);
export const createInventoryCategory = (categoryData) => apiService.create(RESOURCE, categoryData);
export const updateInventoryCategory = (id, categoryData) => apiService.update(RESOURCE, id, categoryData);
export const deleteInventoryCategory = (id) => apiService.delete(RESOURCE, id);
