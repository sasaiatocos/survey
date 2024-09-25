export type User = {
  name: string
  email: string
  role: string
  id: number
}

export type AuthContextState = {
  currentUser: User | null | undefined
}
export type ReactNodeProps = {
  children?: React.ReactNode
}