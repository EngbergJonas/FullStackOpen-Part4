const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.remove({})

    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body.length).toBe(helper.initialBlogs.length)
  })

  describe('viewing a specific blog', () => {
    test('the blog identifier should be id, not _id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToCheck = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToCheck.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(resultBlog.body.id).toBeDefined()
    })
  })

  describe('addition of blogs', () => {
    test('blogs can be added', async () => {
      const blog = new Blog({
        title: 'newPost',
        author: 'newAuthor',
        url: 'newUrl',
        likes: 5
      })

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterSend = await helper.blogsInDb()

      expect(blogsAfterSend.length).toBe(helper.initialBlogs.length + 1)
    })

    test('undefined likes will become zero', async () => {
      const blog = new Blog({
        title: 'newPost',
        author: 'newAuthor',
        url: 'newUrl'
      })

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterSend = await helper.blogsInDb()

      const postedBlog = await blogsAfterSend.find(
        blog => blog.title === 'newPost'
      )

      expect(postedBlog.likes).toEqual(0)
    })

    test('a blog without title or url returns 400', async () => {
      const blog = new Blog({
        author: 'newAuthor',
        likes: 5
      })

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('deletion of blogs', () => {
    test('when deleted the status should be 204', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length - 1)

      const contents = blogsAtEnd.map(r => r.title)
      expect(contents).not.toContain(blogToDelete.content)
    })
  })

  describe('updating of blogs', () => {
    test('a blog can be updated', async () => {
      const blog = {
        title:
          'updatedTitle - this gets through even thought Im getting 500 "internal server error"'
      }

      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      console.log('Blog to update: ', blogToUpdate)

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const blogAfterUpdate = blogsAtEnd[0]

      expect(blogAfterUpdate.title).toBe(blog.title)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
