import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
              authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_uwkbeqeK2',
              redirectUrl: 'https://d84l1y8p4kdic.cloudfront.net',
              postLogoutRedirectUri: window.location.origin,
              clientId: '5ndje5n407l8j0k0c3uet7vsl',
              scope: 'openid email phone', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
          }
}
