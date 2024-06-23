export const getAllProductsReducer = (state = { products: [], loading: false, error: null }, action) => {
    switch (action.type) {
        case 'GET_PRODUCTS_REQUEST':
            return { ...state, loading: true };
        case 'GET_PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: action.payload };
        case 'GET_PRODUCTS_FAILED':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
