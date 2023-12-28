interface HeaderProp {
  isMain: boolean;
  headerContent?: string;
}

class Header {
  private isMain: boolean;

  private headerTitle;

  constructor({ isMain, headerContent }: HeaderProp) {
    this.isMain = isMain;
    this.headerTitle = document.createElement('div');

    this.headerTitle.setAttribute('id', 'header-title');

    if (!this.isMain) {
      this.headerTitle.innerText = `JEI ${headerContent}`;
    }
    const headerTitleStyles = {
      fontSize: '1.6rem',
      color: '#ffffff',
      padding: '1rem',
    };

    Object.assign(this.headerTitle.style, headerTitleStyles);
  }
  render(): HTMLElement {
    return this.headerTitle;
  }
}

export default Header;
