# Changelog

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