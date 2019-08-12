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
    })

    test('the username needs to be at least 3 characters', async () => {
      const user = {
        username: 'us',
        name: 'name',
        password: 'password'
      }

      await api
        .post(`/api/users`)
        .send(user)
        .expect(400)
    })

    test('the password needs to be at least 3 characters', async () => {
      const user = {
        username: 'username',
        name: 'name',
        password: 'pa'
      }

      await api
        .post(`/api/users`)
        .send(user)
        .expect(400)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
