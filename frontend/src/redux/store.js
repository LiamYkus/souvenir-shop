import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { cartReducer } from "./reducers/cart";
import { wishlistReducer } from "./reducers/wishlist";
import { orderReducer } from "./reducers/order";
import { invoiceReducer } from "./reducers/invoice";
import { bannerReducer } from "./reducers/banner";
import { supplierReducer } from "./reducers/supplier";
import { categoryReducer } from "./reducers/category";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    invoices: invoiceReducer,
    banners: bannerReducer,
    suppliers: supplierReducer,
    categories: categoryReducer,
  },
});

export default Store;
