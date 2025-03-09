import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFiltersFromUrl, filtersToUrlParams } from '../utils/tableFilters';

/**
 * Hook to synchronize table state with URL parameters
 * This allows bookmarking, sharing links with filters, and browser history navigation
 * 
 * @param {Object} tableState - Current table state (page, rowsPerPage, sortBy, sortDirection, filters)
 * @param {Function} setPage - Function to set page
 * @param {Function} setRowsPerPage - Function to set rows per page
 * @param {Function} setSortBy - Function to set sort field
 * @param {Function} setSortDirection - Function to set sort direction
 * @param {Function} setFilters - Function to set filters
 * @param {boolean} enabled - Whether URL synchronization is enabled
 */
const useUrlTableState = (
  tableState,
  { setPage, setRowsPerPage, setSortBy, setSortDirection, setFilters },
  enabled = true
) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load state from URL on mount
  useEffect(() => {
    if (!enabled) return;
    
    const searchParams = new URLSearchParams(location.search);
    
    // Extract pagination
    const page = searchParams.get('page');
    if (page !== null) {
      setPage(parseInt(page, 10));
    }
    
    const pageSize = searchParams.get('pageSize');
    if (pageSize !== null) {
      setRowsPerPage(parseInt(pageSize, 10));
    }
    
    // Extract sorting
    const sortBy = searchParams.get('sortBy');
    if (sortBy) {
      setSortBy(sortBy);
    }
    
    const sortDir = searchParams.get('sortDir');
    if (sortDir && (sortDir === 'asc' || sortDir === 'desc')) {
      setSortDirection(sortDir);
    }
    
    // Extract filters
    const filters = getFiltersFromUrl(searchParams);
    if (Object.keys(filters).length > 0) {
      setFilters(filters);
    }
  }, [enabled]); // Only run on mount
  
  // Update URL when table state changes
  useEffect(() => {
    if (!enabled) return;
    
    const { page, rowsPerPage, sortBy, sortDirection, filters } = tableState;
    const searchParams = new URLSearchParams();
    
    // Add pagination params
    searchParams.set('page', page.toString());
    searchParams.set('pageSize', rowsPerPage.toString());
    
    // Add sorting params
    if (sortBy) {
      searchParams.set('sortBy', sortBy);
      searchParams.set('sortDir', sortDirection);
    }
    
    // Add filter params
    const filterParams = filtersToUrlParams(filters);
    for (const [key, value] of filterParams.entries()) {
      searchParams.set(key, value);
    }
    
    // Update the URL without reloading the page
    const newSearch = searchParams.toString();
    if (location.search !== `?${newSearch}`) {
      navigate({
        pathname: location.pathname,
        search: newSearch
      }, { replace: true });
    }
  }, [tableState, enabled, navigate, location.pathname]);
};

export default useUrlTableState;