import { Given, When, Then } from '@cucumber/cucumber';
import { handler } from '../../src/handler';
import { strict as assert } from 'assert';

let mockEvent: any;
let mockContext: any;
let response: any;

Given('a valid input event', function () {
  mockEvent = {};
  mockContext = {
    clientContext: {}
  };
});

When('the lambda function is invoked', async function () {
  response = await handler(mockEvent, mockContext);
});

Then('it should return a successful response', function () {
  assert.equal(response.statusCode, 200);
});

Then('the response should contain the expected message', function () {
  const body = JSON.parse(response.body);
  assert.equal(body.message, 'Function executed successfully');
  assert.ok(body.timestamp);
});