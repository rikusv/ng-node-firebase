import { CustomersAppPage } from './app.po';

describe('customers-app App', () => {
  let page: CustomersAppPage;

  beforeEach(() => {
    page = new CustomersAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
