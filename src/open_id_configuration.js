/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export class OpenIDConfiguration {
  constructor (
    authorizationEndpoint,
    tokenEndpoint,
    idTokenVerificationEndpoint
  ) {
    this.authorizationEndpoint = authorizationEndpoint
    this.tokenEndpoint = tokenEndpoint
    this.idTokenVerificationEndpoint = idTokenVerificationEndpoint
  }

  static fromJSON (responseJSON) {
    return new OpenIDConfiguration(
      responseJSON['authorization_endpoint'],
      responseJSON['token_endpoint'],
      responseJSON['id_token_verification_endpoint']
    )
  }

  static fetchConfig (openIdUrl) {
    let uri = `${openIdUrl}/.well-known/openid-configuration`
    let options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    return fetch(uri, options)
      .then(response => response.json())
      .then(config => OpenIDConfiguration.fromJSON(config))
      .catch(error => console.error('failed to fetch openid configuration from issuer', error))
  }
}
