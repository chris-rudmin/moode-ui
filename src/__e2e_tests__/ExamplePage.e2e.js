describe('Moode', () => {
  const sel = id => `[data-testid="${id}"]`;
  beforeEach(() => page.goto(global.url, { waitUntil: 'networkidle0' }), 25000);

  it('Should load', async () => {
    await expect(page).toMatchElement(sel('app'));
  });
});
