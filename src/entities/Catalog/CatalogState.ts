import { IProductItem } from '../../types';
import { Model } from '../../shared/utils/model';

export type CatalogChangeEvent = {
    catalog: IProductItem[]
};

export class CatalogState extends Model<{ catalog: IProductItem[] }> {
    catalog: IProductItem[] = [];
    preview: string;

    setCatalog(items: IProductItem[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    findProductInCatalog(id: string): IProductItem | undefined {
        return this.catalog.find(product => product.id === id);
    }
}