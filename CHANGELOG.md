# Changelog

## [1.1.10] - 2020-04-30
### Added
- The Grab Javascript SDK now supports the state parameter. This is an opaque value used to maintain state between the request and the callback. This can also be used by the caller to maintain session specific state.

## [1.1.9] - 2019-10-30
### Added
- The Grab Javascript SDK now supports the ui_locales parameter. This allows the caller to override the language shown to the user during authentication flows.

## [1.1.8] - 2019-08-22
### Added
- Adding tests for main functions handling authorization

### Changed
- Refactored code to make functions more testable
- makeTestEndpointRequest has been removed

## [1.1.7] - 2019-08-05
### Fixed
- Adding fetch polyfill to support older browsers

## [1.1.6] - 2019-07-29
### Added
- Adding login_hint as parameter that can be passed in during instantiation to be passed along in the authorization flows

### Fixed
- You can now pass null for loginReturnUrl on the authorization request functions and it will not override the default login return url. Previously, you had to pass undefined if you wanted to skip that parameter.

## [1.1.5] - 2019-07-24
### Added
- Adding code to AuthenticationData returned by getResult

## [1.1.4] - 2019-06-26
### Bugfixes
- Fixing situation where no request param is passed in

## [1.1.3] - 2019-06-26
### Added
- You can now pass a request string along with your authorization or implicit authorization request
- You can now pass an id_token_hint with your implicit authorization request

## [1.1.2] - 2019-05-17
### Changed
- Changed the endpoint for partner endpoints from partner-gateway to partner-api. This is purely a cosmetic change, as they are aliases of one another.

## [1.1.1] - 2019-05-16
### Added
- Added GrabPartnerUrls to the GrabID object. Most external partners using the SDK will use this instead of GrabUrls going forward.

### Bugfixes
- Fixed a bug when acrValues are not specified or when additionalValues are specified

## [1.1.0] - 2019-05-02
### Added
- This changelog (Hello!)
- Users can now specify a structured object for Acr values in the Grab ID Configuration that is passed in the constructor. Previously, users had to construct a string in a very specific format by hand. This should help users of this library to pass in Acr values more reliably.
- Added GrabUrls as a static object on the GrabID class. Users can now specify GrabID.GrabUrls.PRODUCTION instead of invoking the getGrabUrls() function.

### Changed
- Converted the library to TypeScript! This should make the code a little more readable for those who want to trawl through and understand the code.
- It is no longer necessary to make calls to getOpenIdConfiguration prior to making other calls to the service. If the open ID configuration has not yet been retrieved, functions that require it will attempt to retrieve it.
- Marking makeTestEndpointRequest as deprecated. This will be removed in the next minor release.

## [1.0.11] - 2019-03-26
### Added
- Ability for users to pass in an id token to authentication requests

## [1.0.8] - 2019-02-01
### Added
- Ability for users to pass in a URI when making authentication requests to specify where the user is redirected after an authentication request completes

### Changed
- Rewrote README to be more helpful to first-time users of the API

## [1.0.7] - 2019-01-09
### Added
- First public release