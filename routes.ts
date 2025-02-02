// Array of routes that are accessible to the public. They don't require authentication
// @type {string[]}
export const publicRoutes = [
    "/"
];

// Array of routes that are used for authentication. They will redirect logged in users to /search
// @type {string[]}
export const authRoutes = [
    "/auth/login",
    "/auth/register"
];

// The prefix for api authentication routes. Routes that start with these prefix are used for API authentication purposes
// @type {string}
export const apiAuthPrefix = "/api/auth";

//The default redirect path after loggin in
//@type {string}
export const DEFAULT_LOGIN_REDIRECT = "/profile";