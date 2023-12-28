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

    const buttonStyles = {
      width: '300px',
      height: '60px',
      borderRadius: '10px',
      border: 'none',
      margin: '1rem',
      fontSize: '29px',
      fontFamily: 'MaplestoryOTFBold',
      backgroundColor: '#FFEBED',
      color: '#E5001A',
      cursor: 'pointer',
    };

    this.buttonElement.addEventListener('mouseenter', () => {
      this.buttonElement.style.backgroundColor = '#E5001A';
      this.buttonElement.style.color = '#FFFFFF';
    });

    this.buttonElement.addEventListener('mouseleave', () => {
      this.buttonElement.style.backgroundColor = '#FFEBED';
      this.buttonElement.style.color = '#E5001A';
    });

    Object.assign(this.buttonElement.style, buttonStyles);

    if (this.onClick) {
      this.buttonElement.addEventListener('click', this.onClick);
    }
  }

  render(): HTMLButtonElement {
    return this.buttonElement;
  }
}

export default Button;
