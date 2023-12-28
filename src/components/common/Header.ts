interface HeaderProp {
  isMain: boolean;
  headerContent?: string;
}

class Header {
  private isMain: boolean;

  private Header;

  constructor({ isMain, headerContent }: HeaderProp) {
    this.isMain = isMain;
    this.Header = document.createElement('header');

    if (!this.isMain) {
      this.Header.innerText = `JEI ${headerContent}`;
    }
  }
  render(): HTMLElement {
    return this.Header;
  }
}

export default Header;
