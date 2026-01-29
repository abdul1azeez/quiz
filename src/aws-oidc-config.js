
export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Afq6iMcfw", // your user pool URL
  client_id: "37icvcbs4b48ojjlhmog2apaat", // your App client ID
  
  // redirect_uri: "http://localhost:5173/", // your hosted app URL
  // post_logout_redirect_uri: "http://localhost:5173/", // your hosted app URL

  redirect_uri: "https://mineglobal.org/", // your hosted app URL
  post_logout_redirect_uri: "https://mineglobal.org/", // your hosted app URL
  
  response_type: "code",
  scope: "openid email phone profile",


};
