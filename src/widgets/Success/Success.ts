import { Component } from '../../shared/ui/Component/Component';
import { ensureElement } from '../../shared/utils/utils';

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _closeBtn: HTMLButtonElement;

    constructor(protected container: HTMLElement, actions?: ISuccessActions) {
        super(container);
        this.initializeElements();
        this.initializeCloseButton(actions);
    }

    private initializeElements() {
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    }

    private initializeCloseButton(actions?: ISuccessActions) {
        if (actions?.onClick) {
            this._closeBtn.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}
