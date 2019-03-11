import * as GrabID from '@grab-id/grab-id-client/dist/bundle';

const clientConfigDevelopment = {
  openIdUrl: GrabID.getGrabUrls().STAGING,
  grabApiDomain: 'api.grab.dev',
  clientId: '8c40aab965e9449483b9ff3aabcfaa79',
  scopes: ['openid', 'profile.read', 'ride.book'],
};

const clientConfigProduction = {
  openIdUrl: GrabID.getGrabUrls().PRODUCTION,
  grabApiDomain: 'api.grab.com',
  clientId: '6b3e342dca0a46d7a1d8ce2ff11420fa',
  scopes: ['openid', 'profile.read', 'ride.book'],
};

const clientConfigStaging = {
  openIdUrl: GrabID.getGrabUrls().STAGING,
  grabApiDomain: 'api.stg-myteksi.com',
  clientId: '8c40aab965e9449483b9ff3aabcfaa79',
  scopes: ['openid', 'profile.read', 'ride.book'],
}

export const clientConfig = (window.location.origin === 'http://localhost:3000') ?
    clientConfigDevelopment :
    (window.location.origin === 'https://d2l3rxgole2qge.cloudfront.net') ?
    clientConfigStaging :
    clientConfigProduction;
