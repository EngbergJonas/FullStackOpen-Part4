const Blog = require('../models/blog')

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

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
}
