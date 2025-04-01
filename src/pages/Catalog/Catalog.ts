import { Component } from "../../shared/ui/Component/Component";
import { IEvents } from "../../shared/utils/events";
import { ensureElement } from "../../shared";

export interface ICatalogState {
    itemCount: number;
    itemsList: HTMLElement[];
    isDisabled: boolean;
}

export class Catalog extends Component<ICatalogState> {
    private _itemCountDisplay: HTMLElement;
    private _galleryContainer: HTMLElement;
    private _pageWrapper: HTMLElement;
    private _cartButton: HTMLElement;

    constructor(root: HTMLElement, private eventManager: IEvents) {
        super(root);

        this._itemCountDisplay = ensureElement<HTMLElement>('.header__basket-counter');
        this._galleryContainer = ensureElement<HTMLElement>('.gallery');
        this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._cartButton = ensureElement<HTMLElement>('.header__basket');

        this._setupCartInteraction();
    }

    private _setupCartInteraction() {
        this._cartButton.addEventListener('click', () => {
            this.eventManager.emit('cart:toggle');
        });
    }

    set itemCount(value: number) {
        this._updateTextContent(this._itemCountDisplay, String(value));
    }

    set itemsList(elements: HTMLElement[]) {
        this._populateGallery(elements);
    }

    set isDisabled(state: boolean) {
        this._toggleOverlay(state);
    }

    private _updateTextContent(element: HTMLElement, text: string) {
        element.textContent = text;
    }

    private _populateGallery(elements: HTMLElement[]) {
        this._galleryContainer.innerHTML = '';
        elements.forEach(element => this._galleryContainer.appendChild(element));
    }

    private _toggleOverlay(state: boolean) {
        this._pageWrapper.classList.toggle('page__overlay_active', state);
    }
}


