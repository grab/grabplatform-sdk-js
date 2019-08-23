/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import App from './index';
import Store from './store';
import { codeMismatchError, errorFromParams } from './utils';
import { OpenIDConfiguration } from './open_id_configuration';
import { AuthorizationRequestHandler, AuthorizationRequest } from './authorization_request_handler';

describe('GrabID SDK Main Tests', () => {
  test('getAcrValuesString returns empty string if acrValues is not set', () => {
    const grabID = new App(
      App.GrabUrls.PRODUCTION, 
      { 
        clientId: 'foo', 
        redirectUri: 'https://testuri.grab.com/token.html', 
        scope: 'foo'
      }
    );
    expect(grabID.acrValues).toBe('');
  });

  test('getAcrValuesString should return expected valuea when acrValues are present', () => {
    const grabID = new App(
      App.GrabUrls.PRODUCTION, 
      { 
        clientId: 'foo', 
        redirectUri: 'https://testuri.grab.com/token.html', 
        scope: 'foo',
        acrValues: {
          consentContext: {
            countryCode: 'SG',
            currency: 'SG'
          }
        }
      }
    );

    expect(grabID.acrValues).toBe('consent_ctx:countryCode=SG,currency=SG');

    let acrContext1 = grabID.getAcrValuesString({ 
      consentContext: {
        countryCode: 'US',
        currency: 'US',
        someOtherValue: 'someTestValue'
      }
    });

    expect(acrContext1).toBe('consent_ctx:countryCode=US,currency=US,someOtherValue=someTestValue');

    let acrContext2 = grabID.getAcrValuesString({
      service: 'PASSENGER',
      consentContext: {
        countryCode: 'US',
        currency: 'US'
      },
      additionalValues: {
        testValue: 'someTest'
      }
    });

    expect(acrContext2).toBe('service:PASSENGER consent_ctx:countryCode=US,currency=US testValue:someTest');
  });
});

describe('handleAuthorizationCodeFlowResponse tests', () => {
  test('sets code in store if flow is successful', () => {
    const testState = 'A7V9fa1'
    const testCode = 'Good code';
    const storeGetSpy = jest.spyOn(Store, 'getItem');
    const storeSetSpy = jest.spyOn(Store, 'setItem');
    const mockStore = {
      state: testState,
      code: '',
    };
    storeGetSpy.mockImplementation(key => mockStore[key]);
    storeSetSpy.mockImplementation((key, value) => mockStore[key] = value);
    window.history.pushState({}, 'Test', `/token.html?state=${testState}&code=${testCode}`);
    App.handleAuthorizationCodeFlowResponse();
    expect(mockStore.code).toBe(testCode);
  });
  
  test('throws error if state does not match', () => {
    const testState = 'A7V9fa1'
    const testCode = 'Good code';
    const storeGetSpy = jest.spyOn(Store, 'getItem');
    const storeSetSpy = jest.spyOn(Store, 'setItem');
    const mockStore = {
      state: testState,
      code: '',
    };
    storeGetSpy.mockImplementation(key => mockStore[key]);
    storeSetSpy.mockImplementation((key, value) => mockStore[key] = value);
    window.history.pushState({}, 'Test', `/token.html?state=A9v1fdt&code=${testCode}`);
    expect(() => App.handleAuthorizationCodeFlowResponse()).toThrowError(codeMismatchError());
    expect(mockStore.code).toBe('');
  });

  test('throws error indicated in url if error is passed back', () => {
    const testState = 'A7V9fa1'
    const testParams = {
      error: 'FatalError',
      error_description: 'Something went wrong. Please try again.',
    }
    const storeGetSpy = jest.spyOn(Store, 'getItem');
    const storeSetSpy = jest.spyOn(Store, 'setItem');
    const mockStore = {
      state: testState,
      code: '',
    };
    storeGetSpy.mockImplementation(key => mockStore[key]);
    storeSetSpy.mockImplementation((key, value) => mockStore[key] = value);
    window.history.pushState({}, 'Test', `/token.html?state=${testState}&error=${testParams.error}&error_description=${testParams.error_description}`);
    expect(() => App.handleAuthorizationCodeFlowResponse()).toThrowError(errorFromParams(testParams));
    expect(mockStore.code).toBe('');
  });
});

describe('handleImplicitFlowResponse tests', () => {
  test('sets code in store if flow is successful', () => {
    const testState = 'A7V9fa1'
    const testIdToken = 'ExcellentIdToken';
    const testAccessToken = 'RadicalAccessToken';
    const storeGetSpy = jest.spyOn(Store, 'getItem');
    const storeSetSpy = jest.spyOn(Store, 'setItem');
    const mockStore = {
      state: testState,
      id_token: '',
      access_token: '',
    };
    storeGetSpy.mockImplementation(key => mockStore[key]);
    storeSetSpy.mockImplementation((key, value) => mockStore[key] = value);
    window.history.pushState({}, 'Test', `/token.html#state=${testState}&id_token=${testIdToken}&access_token=${testAccessToken}`);
    App.handleImplicitFlowResponse();
    expect(mockStore.id_token).toBe(testIdToken);
    expect(mockStore.access_token).toBe(testAccessToken);
  });
  
  test('throws error if state does not match', () => {
    const testState = 'A7V9fa1'
    const testCode = 'Good code';
    const storeGetSpy = jest.spyOn(Store, 'getItem');
    const storeSetSpy = jest.spyOn(Store, 'setItem');
    const mockStore = {
      state: testState,
      id_token: '',
      access_token: '',
    };
    storeGetSpy.mockImplementation(key => mockStore[key]);
    storeSetSpy.mockImplementation((key, value) => mockStore[key] = value);
    window.history.pushState({}, 'Test', `/token.html#state=A9v1fdt&code=${testCode}`);
    expect(() => App.handleImplicitFlowResponse()).toThrowError(codeMismatchError());
    expect(mockStore.id_token).toBe('');
    expect(mockStore.access_token).toBe('');
  });

  test('throws error indicated in url if error is passed back', () => {
    const testState = 'A7V9fa1'
    const testParams = {
      error: 'FatalError',
      error_description: 'Something went wrong. Please try again.',
    }
    const storeGetSpy = jest.spyOn(Store, 'getItem');
    const storeSetSpy = jest.spyOn(Store, 'setItem');
    const mockStore = {
      state: testState,
      id_token: '',
      access_token: '',
    };
    storeGetSpy.mockImplementation(key => mockStore[key]);
    storeSetSpy.mockImplementation((key, value) => mockStore[key] = value);
    window.history.pushState({}, 'Test', `/token.html#state=${testState}&error=${testParams.error}&error_description=${testParams.error_description}`);
    expect(() => App.handleImplicitFlowResponse()).toThrowError(errorFromParams(testParams));
    expect(mockStore.id_token).toBe('');
    expect(mockStore.access_token).toBe('');
  });
});

describe('Authorization Request tests', () => {
  let grabIdAuthClient: App;

  const mockOpenIdConfiguration : OpenIDConfiguration = { 
    authorizationEndpoint: 'api.grab.com/auth',
    tokenEndpoint: 'api.grab.com/token',
    idTokenVerificationEndpoint: 'api.grab.com/idtoken'   
  };

  let expectedAuthorizationRequest: any;

  let authRequestHandlerSpy: jest.SpyInstance<void, [OpenIDConfiguration, AuthorizationRequest]>;

  beforeAll(() => {
    const openIdConfigSpy = jest.spyOn(OpenIDConfiguration, 'fetchConfig');
    openIdConfigSpy.mockImplementation(() => Promise.resolve(mockOpenIdConfiguration));
    authRequestHandlerSpy = jest.spyOn(AuthorizationRequestHandler, 'performAuthorizationRequest');
    authRequestHandlerSpy.mockImplementation(() => null);
    grabIdAuthClient = new App(
      App.GrabUrls.PRODUCTION, 
      { 
        clientId: 'TestClientID', 
        redirectUri: 'https://testuri.grab.com/token.html', 
        scope: 'TestScope',
        acrValues: {
          consentContext: {
            countryCode: 'SG',
            currency: 'SG'
          }
        }
      }
    );
    expectedAuthorizationRequest = {
      clientId: grabIdAuthClient.clientId,
      redirectUri: grabIdAuthClient.redirectUri,
      scope: grabIdAuthClient.scope,
      acrValues: grabIdAuthClient.acrValues,
      request: grabIdAuthClient.request,
      login_hint: grabIdAuthClient.login_hint,
    };
  });

  beforeEach(() => {
    authRequestHandlerSpy.mockClear();
  });

  test('makeAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with no arguments', async () => {
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_CODE,
    };
    await grabIdAuthClient.makeAuthorizationRequest();
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with loginReturnUri provided', async () => {
    const testReturnUri = 'testuri.grab.com/token.html';
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_CODE,
      loginReturnUri: testReturnUri,
    };
    await grabIdAuthClient.makeAuthorizationRequest(testReturnUri);
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with loginReturnUri and id token hint provided', async () => {
    const testReturnUri = 'testuri.grab.com/token.html';
    const sampleIdTokenHint = 'TestIdTokenHint';
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_CODE,
      loginReturnUri: testReturnUri,
      id_token_hint: sampleIdTokenHint,
    };
    await grabIdAuthClient.makeAuthorizationRequest(testReturnUri, sampleIdTokenHint);
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with id token hint provided', async () => {
    const sampleIdTokenHint = 'TestIdTokenHint';
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_CODE,
      id_token_hint: sampleIdTokenHint,
      loginReturnUri: null,
    };
    await grabIdAuthClient.makeAuthorizationRequest(null, sampleIdTokenHint);
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeImplicitAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with no arguments', async () => {
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_TOKEN,
    };
    await grabIdAuthClient.makeImplicitAuthorizationRequest();
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeImplicitAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with loginReturnUri provided', async () => {
    const testReturnUri = 'testuri.grab.com/token.html';
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_TOKEN,
      loginReturnUri: testReturnUri,
    };
    await grabIdAuthClient.makeImplicitAuthorizationRequest(testReturnUri);
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeImplicitAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with loginReturnUri and id token hint provided', async () => {
    const testReturnUri = 'testuri.grab.com/token.html';
    const sampleIdTokenHint = 'TestIdTokenHint';
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_TOKEN,
      loginReturnUri: testReturnUri,
      id_token_hint: sampleIdTokenHint,
    };
    await grabIdAuthClient.makeImplicitAuthorizationRequest(testReturnUri, sampleIdTokenHint);
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });

  test('makeImplicitAuthorizationRequest makes the appropriate call to AuthorizationRequestHandler with id token hint provided', async () => {
    const sampleIdTokenHint = 'TestIdTokenHint';
    const authRequest: AuthorizationRequest = {
      ...expectedAuthorizationRequest,
      responseType: AuthorizationRequest.RESPONSE_TYPE_TOKEN,
      id_token_hint: sampleIdTokenHint,
      loginReturnUri: null,
    };
    await grabIdAuthClient.makeImplicitAuthorizationRequest(null, sampleIdTokenHint);
    expect(authRequestHandlerSpy).toHaveBeenCalledWith(mockOpenIdConfiguration, authRequest);
  });
});