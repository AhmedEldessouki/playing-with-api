type AppLocation = {
  street: string
  city: string
  state: string
  country: string
  timezone: string
}

type User = {
  id: string
  title: string
  firstName: string
  lastName: string
  gender: string
  email: string
  dateOfBirth: string
  registerDate: string
  phone: string
  picture: string
  location: AppLocation
}

type Post = {
  text: string
  image: string
  likes: number
  link: string
  tags: Array<string>
  publishDate: string
  owner: User
}

type Tag = {
  title: string
}

type AppComment = {
  id: string
  message: string
  owner: User
  publishDate: string
}

type StatusType = 'idle' | 'pending' | 'resolved' | 'rejected'

type AppResponse<T> = {
  status: StatusType
  data?: T
  error?: Error
}

type UserPage = {
  data: Array<User>
  limit: number
  offset: number
  page: number
  total: number
}

export {
  AppComment,
  AppResponse,
  AppLocation,
  Post,
  Tag,
  User,
  UserPage,
  StatusType,
}
