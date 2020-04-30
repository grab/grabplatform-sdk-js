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
import { getParams, codeMismatchError, errorFromParams } from './utils'
import Store from './store'
import { GrabConfig, AcrValues } from './grabConfig';
import { AuthenticationData } from './authenticationData';
import 'whatwg-fetch';

export default class App {
  openIdUrl: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  acrValues: string;
  request: string;
  login_hint: string;
  ui_locales: string;
  state: string;
  openIDConfiguration: OpenIDConfiguration;

  static GrabUrls = {
    STAGING: 'https://api.stg-myteksi.com/grabid/v1/oauth2',
    PRODUCTION: 'https://api.grab.com/grabid/v1/oauth2',
  }

  static GrabPartnerUrls = {
    STAGING: 'https://partner-api.stg-myteksi.com/grabid/v1/oauth2',
    PRODUCTION: 'https://partner-api.grab.com/grabid/v1/oauth2',
  }

  constructor (openIdUrl: string, appConfig: GrabConfig) {
    this.openIdUrl = openIdUrl
    this.clientId = appConfig.clientId
    this.redirectUri = appConfig.redirectUri
    this.scope = appConfig.scope
    this.request = appConfig.request
    this.login_hint = appConfig.login_hint;
    this.ui_locales = appConfig.ui_locales;
    this.state = appConfig.state;
    if (typeof(appConfig.acrValues) === 'string') {
      this.acrValues = appConfig.acrValues;
    } else {
      this.acrValues = this.getAcrValuesString(appConfig.acrValues);
    }

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
    if (!acrValues) {
      return '';
    }
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
          acrValuesArray.push(`${key}:${acrValues.additionalValues[key]}`) 
        }
      );
    }
    
    return acrValuesArray.join(' ');
  }

  async makeAuthorizationRequest (loginReturnUrl?: string, id_token_hint?: string): Promise<void> {
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
      id_token_hint,
      this.request,
      this.login_hint,
      this.ui_locales,
      this.state,
    )
    AuthorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest)
  }

  async makeImplicitAuthorizationRequest (loginReturnUrl?: string, id_token_hint?: string): Promise<void> {
    if (!this.openIDConfiguration) {
      await this.getOpenIdConfiguration();
    }

    let authorizationRequest = new AuthorizationRequest(
      this.clientId,
      this.redirectUri,
      this.scope,
      AuthorizationRequest.RESPONSE_TYPE_TOKEN,
      this.acrValues,
      loginReturnUrl,
      id_token_hint,
      this.request,
      this.login_hint,
      this.ui_locales,
      this.state,
    )
    AuthorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest)
  }

  static getLoginReturnURI (): string {
    return Store.getItem('login_return_uri')
  }

  static handleAuthorizationCodeFlowResponse () {
    let state = Store.getItem('state')
    let params = getParams(window.location.search)

    if (params === null || state !== params['state']) {
      throw codeMismatchError();
    } else if (params['error']) {
      throw errorFromParams(params);
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
      throw codeMismatchError();
    } else if (params['error']) {
      throw errorFromParams(params);
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

    const response = await TokenRequestHandler.performTokenRequest(this.openIDConfiguration, tokenRequest);
    let tokenResponse = TokenResponse.fromJSON(response);
    Store.setItem('access_token', tokenResponse.accessToken);
    Store.setItem('id_token', tokenResponse.idToken);
  }

  static getResult (): AuthenticationData {
    return {
      accessToken: Store.getItem('access_token'),
      codeVerifier: Store.getItem('code_verifier'),
      idToken: Store.getItem('id_token'),
      nonce: Store.getItem('nonce'),
      state: Store.getItem('state'),
      code: Store.getItem('code'),
    }
  }

  static getGrabUrls () {
    return App.GrabUrls;
  }
}
