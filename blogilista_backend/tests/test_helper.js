const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl',
    likes: 3
  },
  {
    title: 'anotherTest',
    author: 'anotherAuthor',
    url: 'anotherUrl',
    likes: 25
  }
]

const initialUsers = [
  {
    username: 'user1',
    name: 'name1',
    password: 'password1'
  },
  {
    username: 'user2',
    name: 'name2',
    password: 'password2'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb
}
