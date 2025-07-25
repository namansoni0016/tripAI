import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from "../routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    if(isApiAuthRoute) {
        return undefined;
    }
    if(isAuthRoute) {
        if(isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return undefined;
    }
    if(!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }
    return undefined;
});

//Don't invoke middleware on some paths
export const config = {
    matcher: ["/((?!api/uploadthing|_next|.*\\..*).*)",]
}