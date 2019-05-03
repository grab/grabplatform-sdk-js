/**
 * Copyright (c) Grab Taxi Holdings PTE LTD (GRAB)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export class OpenIDConfiguration {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  idTokenVerificationEndpoint: string;

  constructor (
    authorizationEndpoint: string,
    tokenEndpoint: string,
    idTokenVerificationEndpoint: string
  ) {
    this.authorizationEndpoint = authorizationEndpoint
    this.tokenEndpoint = tokenEndpoint
    this.idTokenVerificationEndpoint = idTokenVerificationEndpoint
  }

  static fromJSON (responseJSON: Object) : OpenIDConfiguration {
    return new OpenIDConfiguration(
      responseJSON['authorization_endpoint'],
      responseJSON['token_endpoint'],
      responseJSON['id_token_verification_endpoint']
    )
  }

  static async fetchConfig (openIdUrl) : Promise<OpenIDConfiguration> {
    const uri = `${openIdUrl}/.well-known/openid-configuration`
    const options : RequestInit = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    const response = await fetch(uri, options);
    const config = await response.json();
    return OpenIDConfiguration.fromJSON(config);
  }
}
