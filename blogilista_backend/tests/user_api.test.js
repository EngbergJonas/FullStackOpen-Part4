const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there is initially some users saved', () => {
  beforeEach(async () => {
    await User.remove({})

    const userObjects = helper.initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const res = await api.get('/api/users')

    expect(res.body.length).toBe(helper.initialUsers.length)
  })

  describe('creation of users', () => {
    test('a user can be added', async () => {
      const user = {
        username: 'username',
        name: 'name',
        password: 'password'
      }

      await api
        .post(`/api/users`)
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAfterPost = await helper.usersInDb()
      expect(usersAfterPost.length).toBe(helper.initialUsers.length + 1)

      const usernames = usersAfterPost.map(u => u.username)
      expect(usernames).toContain(user.username)
    })

    test('the username needs to be at least 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = {
        username: 'us',
        name: 'name',
        password: 'password'
      }

      const result = await api
        .post(`/api/users`)
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain(
        'is shorter than the minimum allowed '
      )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('the password needs to be at least 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'username',
        name: 'name',
        password: 'pa'
      }

      const result = await api
        .post(`/api/users`)
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password needs to be at least 3')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('the username must be unique', async () => {
      const usersAtStart = await helper.usersInDb()

      const user = {
        username: 'user1',
        name: 'name1',
        password: 'password1'
      }

      const result = await api
        .post(`/api/users`)
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
