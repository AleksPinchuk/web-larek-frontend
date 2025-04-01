import { Api, ApiListResponse } from '../../shared/api/api';
import { IOrderDetails, IProduct } from '../../types';

export class Methods extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProductById(id: string) {
        return this.get(`/product/${id}`)
            .then((product: IProduct) => this._mapProduct(product));
    }

    getAllProducts() {
        return this.get(`/product`)
            .then((data: ApiListResponse<IProduct>) => data.items.map(product => this._mapProduct(product)));
    }

    private _mapProduct(product: IProduct): IProduct {
        return {
            ...product,
            imageUrl: this.cdn + product.imageUrl,
            isInBasket: false,
        };
    }

    createOrder(order: IOrderDetails) {
        return this.post(`/order`, order).then((data: IOrderDetails) => data);
    }
}

