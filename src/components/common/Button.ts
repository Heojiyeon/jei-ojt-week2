interface ButtonProp {
  title: string;
  onClick: () => void;
}

class Button {
  private title: string;
  private onClick: () => void;

  private buttonElement: HTMLButtonElement;

  constructor({ title, onClick }: ButtonProp) {
    this.title = title;
    this.onClick = onClick;

    this.buttonElement = document.createElement('button');
    this.buttonElement.textContent = this.title;

    if (this.onClick) {
      this.buttonElement.addEventListener('click', this.onClick);
    }
  }

  render(): HTMLButtonElement {
    return this.buttonElement;
  }
}

export default Button;
