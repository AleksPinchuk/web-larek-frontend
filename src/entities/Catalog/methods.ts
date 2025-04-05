import { Api, ApiListResponse } from '../../shared/api/api';
import { IOrder, IProductItem } from '../../types';

export class Methods extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getAllProducts(): Promise<IProductItem[]> {
        return this.get('/product')
            .then(this.processProductResponse.bind(this));
    }

    createOrder(order: IOrder): Promise<IOrder> {
        return this.post('/order', order)
            .then(data => data as IOrder); 
    }

    private processProductResponse(data: ApiListResponse<IProductItem>): IProductItem[] {
        return data.items.map(this.enhanceProductItem.bind(this));
    }

    private enhanceProductItem(item: IProductItem): IProductItem {
        return {
            ...item,
            image: this.constructImageUrl(item.image),
            inBasket: false,
        };
    }

    private constructImageUrl(imagePath: string): string {
        return `${this.cdn}${imagePath}`;
    }
}