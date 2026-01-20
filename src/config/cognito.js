/**
 * AWS Cognito Configuration for MPWR Customer Portal
 * Borrower User Pool: mpwr-dev-borrowers
 */

export const cognitoConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_4vx7mJKbk',
      userPoolClientId: 'uq3s8i6ndrrq3tkl1p571bjqf',
      loginWith: {
        oauth: {
          domain: 'mpwr-dev-borrower.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [window.location.origin],
          redirectSignOut: [window.location.origin],
          responseType: 'code',
        },
      },
    },
  },
};

export default cognitoConfig;
