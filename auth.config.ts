import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      //!! 用于将任意值转换为布尔值 ，第一个 !（感叹号）将值转换为布尔值并`取反`。例如，!value 会将 value 转换为布尔值，并将其取反。如果 value 是 true，!value 就是 false；如果 value 是 false，!value 就是 true  
      //第二个 ! 再次取反，这样结果就会是原始布尔值
      //?.（可选链操作符）：这是一个用来安全地访问对象的嵌套属性的操作符。它的作用是，如果对象或属性为 null 或 undefined，则返回 undefined，而不会导致错误。这样可以避免访问不存在的属性时抛出异常。
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig; // satisfies 字段 表示 authConfig 至少需要包含 NextAuthConfig 中的字段，并且这些字段的类型必须与 NextAuthConfig 类型相匹配，同时允许 authConfig 定义其他非 NextAuthConfig 的字段（如果有的话）。
