import { Api, ApiListResponse } from '../../shared/api/api';
import { IOrder, IProductItem } from '../../types';

export class Methods extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getAllProducts() {
		return this.get(`/product`).then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
				inBasket: false,
			})),
		);
	}

	createOrder(order: IOrder) {
		return this.post(`/order`, order).then((data: IOrder) => data);
	}
}

