import { Given, When, Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { BusinessService } from '../../src/business/business-service';

let datas: string;
let response: string;
let service: BusinessService = new BusinessService();

Given('some input datas', function () {
  datas = 'test data';
});

When('the business service is invoked', async function () {
  response = await service.process(datas);
});

Then('it should return a successful response', function () {
  assert.equal(response, datas);
});
