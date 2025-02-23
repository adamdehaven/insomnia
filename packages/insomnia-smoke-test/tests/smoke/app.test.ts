import { expect } from '@playwright/test';

import { loadFixture } from '../../playwright/paths';
import { test } from '../../playwright/test';

test('can send requests', async ({ app, page }) => {
  test.slow(process.platform === 'darwin' || process.platform === 'win32', 'Slow app start on these platforms');
  const statusTag = page.locator('[data-testid="response-status-tag"]:visible');
  const responseBody = page.getByTestId('response-pane');

  const text = await loadFixture('smoke-test-collection.yaml');
  await app.evaluate(async ({ clipboard }, text) => clipboard.writeText(text), text);

  await page.getByLabel('Import').click();
  await page.locator('[data-test-id="import-from-clipboard"]').click();
  await page.getByRole('button', { name: 'Scan' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Import' }).click();

  await page.getByRole('button', { name: 'Workspace actions menu button' }).click();
  await page.getByRole('menuitem', { name: 'Export' }).click();
  await page.getByRole('button', { name: 'Export' }).click();
  await page.getByText('Which format would you like to export as?').click();
  await page.locator('.app').press('Escape');

  await page.getByLabel('Smoke tests').click();

  await page.getByLabel('Create in collection').click();
  await page.getByRole('menuitemradio', { name: 'From Curl' }).click();
  const curl = 'curl --request GET --url https://mock.insomnia.rest';
  await page.locator('.CodeMirror textarea').fill(curl);
  await page.getByRole('dialog').getByRole('button', { name: 'Import' }).click();

  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');

  await page.getByLabel('Request Collection').getByTestId('send JSON request').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');
  await expect(responseBody).toContainText('"id": "1"');
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('menuitem', { name: 'Raw Data' }).click();
  await expect(responseBody).toContainText('{"id":"1"}');

  await page.getByLabel('Request Collection').getByTestId('connects to event stream and shows ping response').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Connect' }).click();
  await expect(statusTag).toContainText('200 OK');
  await page.getByRole('tab', { name: 'Console' }).click();
  await expect(responseBody).toContainText('Connected to 127.0.0.1');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Disconnect' }).click();

  await page.getByLabel('Request Collection').getByTestId('sends dummy.csv request and shows rich response').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByRole('menuitem', { name: 'Raw Data' }).click();
  await expect(responseBody).toContainText('a,b,c');

  await page.getByLabel('Request Collection').getByTestId('sends dummy.xml request and shows raw response').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');
  await expect(responseBody).toContainText('xml version="1.0"');
  await expect(responseBody).toContainText('<LoginResult>');

  await page.getByLabel('Request Collection').getByTestId('sends dummy.pdf request and shows rich response').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');
  // TODO(filipe): re-add a check for the preview that is less flaky
  await page.getByRole('tab', { name: 'Console' }).click();
  await page.locator('pre').filter({ hasText: '< Content-Type: application/pdf' }).click();

  await page.getByLabel('Request Collection').getByTestId('sends request with basic authentication').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');
  await expect(responseBody).toContainText('basic auth received');

  await page.getByLabel('Request Collection').getByTestId('sends request with cookie and get cookie in response').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
  await expect(statusTag).toContainText('200 OK');
  await page.getByRole('tab', { name: 'Console' }).click();
  await expect(responseBody).toContainText('Set-Cookie: insomnia-test-cookie=value123');
});

// This feature is unsafe to place beside other tests, cancelling a request can cause network code to block
// related to https://linear.app/insomnia/issue/INS-973
test('can cancel requests', async ({ app, page }) => {
  const text = await loadFixture('smoke-test-collection.yaml');
  await app.evaluate(async ({ clipboard }, text) => clipboard.writeText(text), text);

  await page.getByLabel('Import').click();
  await page.locator('[data-test-id="import-from-clipboard"]').click();
  await page.getByRole('button', { name: 'Scan' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Import' }).click();
  await page.getByLabel('Smoke tests').click();

  await page.getByLabel('Request Collection').getByTestId('delayed request').press('Enter');
  await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();

  await page.getByRole('button', { name: 'Cancel Request' }).click();
  await page.getByRole('button', { name: 'Ok', exact: true }).click();
  await page.click('text=Request was cancelled');
});
