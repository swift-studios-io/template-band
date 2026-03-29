import type { Access } from 'payload'

/** Any authenticated user */
export const isLoggedIn: Access = ({ req: { user } }) => {
  return !!user
}

/** Only admin-role users */
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

/** Public read access */
export const publicRead: Access = () => true
