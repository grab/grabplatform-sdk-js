/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OpenIDConfiguration } from './open_id_configuration'
import { AuthorizationRequest, AuthorizationRequestHandler } from './authorization_request_handler'
import { TokenRequest, TokenRequestHandler, TokenResponse } from './token_request_handler'
import { getParams, htmlEncode } from './utils'
import Store from './store'
import { GrabConfig, AcrValues } from './grabConfig';
import { AuthenticationData } from './authenticationData';

export default class App {
  openIdUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  acrValues: string;

  authorizationRequestHandler: AuthorizationRequestHandler;
  tokenRequestHandler: TokenRequestHandler;
  openIDConfiguration: OpenIDConfiguration;

  static GrabUrls = {
    STAGING: 'https://api.stg-myteksi.com/grabid/v1/oauth2',
    PRODUCTION: 'https://api.grab.com/grabid/v1/oauth2',
  }

  constructor (openIdUrl: string, appConfig: GrabConfig) {
    this.openIdUrl = openIdUrl
    this.clientId = appConfig.clientId
    this.redirectUri = appConfig.redirectUri
    this.scope = appConfig.scope
    if (typeof(appConfig.acrValues) === 'string') {
      this.acrValues = appConfig.acrValues;
    } else {
      this.acrValues = this.getAcrValuesString(appConfig.acrValues);
    }

    this.authorizationRequestHandler = new AuthorizationRequestHandler()
    this.tokenRequestHandler = new TokenRequestHandler()
    this.openIDConfiguration = undefined
  }

  async getOpenIdConfiguration () : Promise<void> {
    try {
      const response = await OpenIDConfiguration.fetchConfig(this.openIdUrl);
      this.openIDConfiguration = response;
    }
    catch (error) {
      console.error(error);
      throw new Error("Unable to fetch OpenID Configuration");
    }
  }

  getAcrValuesString (acrValues: AcrValues) : string {
    let acrValuesArray: string[] = [];
    if(acrValues.service) {
      acrValuesArray.push(`service:${acrValues.service}`)
    }
    if(acrValues.consentContext) {
      const contextKeys = Object.keys(acrValues.consentContext);
      const contextString = contextKeys.map(key => `${key}=${acrValues.consentContext[key]}`)
        .join(',');
      acrValuesArray.push(`consent_ctx:${contextString}`);
    }
    if(acrValues.additionalValues) {
      const additionalValuesKeys = Object.keys(acrValues.additionalValues);
      additionalValuesKeys.map(
        key => {
          if(key.includes(':')) {
            throw new Error('Acr Value keys cannot contain a semicolon');
          }
          acrValuesArray.push(`${key}:${acrValues.consentContext[key]}`) 
        }
      );
    }
    
    return acrValuesArray.join(' ');
  }

  async makeAuthorizationRequest (loginReturnUrl: string, id_token_hint: string): Promise<void> {
    if (!this.openIDConfiguration) {
      await this.getOpenIdConfiguration();
    }

    let authorizationRequest = new AuthorizationRequest(
      this.clientId,
      this.redirectUri,
      this.scope,
      AuthorizationRequest.RESPONSE_TYPE_CODE,
      this.acrValues,
      loginReturnUrl,
      id_token_hint
    )
    this.authorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest)
  }

  async makeImplicitAuthorizationRequest (loginReturnUrl: string): Promise<void> {
    if (!this.openIDConfiguration) {
      await this.getOpenIdConfiguration();
    }

    let authorizationRequest = new AuthorizationRequest(
      this.clientId,
      this.redirectUri,
      this.scope,
      AuthorizationRequest.RESPONSE_TYPE_TOKEN,
      this.acrValues,
      loginReturnUrl
    )
    this.authorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest)
  }

  static getLoginReturnURI (): string {
    return Store.getItem('login_return_uri')
  }

  static handleAuthorizationCodeFlowResponse () {
    let state = Store.getItem('state')
    let params = getParams(window.location.search)

    if (params === null || state !== params['state']) {
      let errorMsg = {
        name: 'code mismatch',
        message: 'This could be caused by multiple browser windows attempting to authenticate to GrabId at the same time'
      }
      throw new Error(JSON.stringify(errorMsg))
    } else if (params['error']) {
      let errorMsg = {
        name: htmlEncode(params['error']),
        message: htmlEncode(params['error_description'])
      }
      throw new Error(JSON.stringify(errorMsg))
    } else {
      let code = params['code']
      if (code) {
        Store.setItem('code', code)
      }
    }
  }

  static handleImplicitFlowResponse () {
    let state = Store.getItem('state')
    let params = getParams(window.location.hash)

    if (params === null || state !== params['state']) {
      let errorMsg = {
        name: 'code mismatch',
        message: 'This could be caused by multiple browser windows attempting to authenticate to GrabId at the same time'
      }
      throw new Error(JSON.stringify(errorMsg))
    } else if (params['error']) {
      let errorMsg = {
        name: htmlEncode(params['error']),
        message: htmlEncode(params['error_description'])
      }
      throw new Error(JSON.stringify(errorMsg))
    } else {
      let accessToken = params['access_token']
      if (accessToken) {
        Store.setItem('access_token', accessToken)
      }

      let idToken = params['id_token']
      if (idToken) {
        Store.setItem('id_token', idToken)
      }
    }

    return App.getResult()
  }

  async makeTokenRequest () {
    if (!this.openIDConfiguration) {
      await this.getOpenIdConfiguration();
    }

    let codeVerifier = Store.getItem('code_verifier')
    let code = Store.getItem('code')

    if (!codeVerifier || !code) {
      throw new Error('Please get authorization code first')
    }

    let tokenRequest = new TokenRequest(
      this.clientId,
      codeVerifier,
      TokenRequest.GRANT_TYPE_AUTHORIZATION_CODE,
      this.redirectUri,
      code
    )

    const response = await this.tokenRequestHandler.performTokenRequest(this.openIDConfiguration, tokenRequest);
    let tokenResponse = TokenResponse.fromJSON(response);
    Store.setItem('access_token', tokenResponse.accessToken);
    Store.setItem('id_token', tokenResponse.idToken);
  }

  async makeTestEndpointRequest () {
    console.log("This function will be deprecated as of next release.");
    let accessToken = Store.getItem('access_token')
    let uri = 'https://api.stg-myteksi.com/grabid/v1/oauth2/test_res'
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    try {
      const response = await fetch(uri, options);
      return await response.json();
    }
    catch (error) {
      console.error('failed to make test request', error);
    }
  }

  static getResult (): AuthenticationData {
    return {
      accessToken: Store.getItem('access_token'),
      codeVerifier: Store.getItem('code_verifier'),
      idToken: Store.getItem('id_token'),
      nonce: Store.getItem('nonce'),
      state: Store.getItem('state')
    }
  }

  static getGrabUrls () {
    return App.GrabUrls;
  }
}
