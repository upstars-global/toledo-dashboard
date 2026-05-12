// auth.d.ts
declare module '#auth-utils' {
  interface User {
    // Add your own fields
    avatar?: string
    email: string
    name: string
    id: string
  }
}

export {}
