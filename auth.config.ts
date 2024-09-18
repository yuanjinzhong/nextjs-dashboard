import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig; // satisfies 字段 表示 authConfig 至少需要包含 NextAuthConfig 中的字段，并且这些字段的类型必须与 NextAuthConfig 类型相匹配，同时允许 authConfig 定义其他非 NextAuthConfig 的字段（如果有的话）。