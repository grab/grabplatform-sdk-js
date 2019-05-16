import App from './index';

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