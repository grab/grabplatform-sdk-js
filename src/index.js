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

export default class App {
  constructor (openIdUrl, appConfig) {
    this.openIdUrl = openIdUrl
    this.clientId = appConfig.clientId
    this.redirectUri = appConfig.redirectUri
    this.scope = appConfig.scope
    this.acrValues = appConfig.acrValues

    this.authorizationRequestHandler = new AuthorizationRequestHandler()
    this.tokenRequestHandler = new TokenRequestHandler()
    this.openIDConfiguration = undefined
  }

  getOpenIdConfiguration () {
    return OpenIDConfiguration.fetchConfig(this.openIdUrl)
      .then(response => { this.openIDConfiguration = response })
      .catch(error => console.error('fail to get open id config', error))
  }

  makeAuthorizationRequest (loginReturnUrl) {
    if (!this.openIDConfiguration) {
      throw new Error('Please fetch OpenID configuration first')
    }

    let authorizationRequest = new AuthorizationRequest(
      this.clientId,
      this.redirectUri,
      this.scope,
      AuthorizationRequest.RESPONSE_TYPE_CODE,
      this.acrValues,
      loginReturnUrl
    )
    this.authorizationRequestHandler.performAuthorizationRequest(this.openIDConfiguration, authorizationRequest)
  }

  makeImplicitAuthorizationRequest (loginReturnUrl) {
    if (!this.openIDConfiguration) {
      throw new Error('Please fetch OpenID configuration first')
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

  static getLoginReturnURI () {
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

  makeTokenRequest () {
    if (!this.openIDConfiguration) {
      throw new Error('Please fetch OpenID configuration first')
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

    return this.tokenRequestHandler.performTokenRequest(this.openIDConfiguration, tokenRequest)
      .then(response => {
        let tokenResponse = TokenResponse.fromJSON(response)
        Store.setItem('access_token', tokenResponse.accessToken)
        Store.setItem('id_token', tokenResponse.idToken)
      })
  }

  makeTestEndpointRequest () {
    let accessToken = Store.getItem('access_token')
    let uri = 'https://api.stg-myteksi.com/grabid/v1/oauth2/test_res'
    let options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + accessToken
      }
    }

    return fetch(uri, options)
      .then(response => response.json())
      .catch(error => console.error('failed to make test request', error))
  }

  static getResult () {
    return {
      accessToken: Store.getItem('access_token'),
      codeVerifier: Store.getItem('code_verifier'),
      idToken: Store.getItem('id_token'),
      nonce: Store.getItem('nonce'),
      state: Store.getItem('state')
    }
  }

  static getGrabUrls () {
    return {
      STAGING: 'https://api.stg-myteksi.com/grabid/v1/oauth2',
      PRODUCTION = 'https://api.grab.com/grabid/v1/oauth2',
    }
  }
}
