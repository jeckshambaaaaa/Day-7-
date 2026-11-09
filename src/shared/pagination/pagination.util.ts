import type {
    PaginationParams,
    PaginationMeta,
    PaginationData,
    PaginationResult
} from './pagination.model.js';

export const getPaginationParams = (
    page: number,
    limit: number
): PaginationParams => {

    return {
        page,
        limit,
        offset: (page - 1) * limit
    };
}

export const createPaginationResult = <T>(
    results: PaginationData<T>,
    params: PaginationParams
): PaginationResult<T> => {

    const totalPages = Math.ceil(
        results.totalItems / params.limit
    );

    const pagination: PaginationMeta = {

        page: params.page,

        limit: params.limit,

        totalItems: results.totalItems,

        totalPages,

        hasNextPage: params.page < totalPages,

        hasPreviousPage: params.page > 1
    };

    return {
        data: results.items,
        pagination
    };
};