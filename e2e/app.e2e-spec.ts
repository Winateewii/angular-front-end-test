import { FrontEndTestPage } from './app.po';

describe('front-end-test App', function() {
  let page: FrontEndTestPage;

  beforeEach(() => {
    page = new FrontEndTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
