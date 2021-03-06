const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res, next) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
		id: 1
	})
	res.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (req, res, next) => {
	const body = req.body

	const token = req.token

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return res.status(401).json({ error: 'token missing or invalid' })
		}

		const user = await User.findById(decodedToken.id)

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes === undefined ? 0 : body.likes,
			user: user._id
		})

		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		res.json(savedBlog.toJSON())
	} catch (exception) {
		next(exception)
	}
})

blogsRouter.get('/:id', async (req, res, next) => {
	try {
		const blog = await Blog.findById(req.params.id)
		if (blog) {
			res.json(blog.toJSON())
		} else {
			res.status(404).end()
		}
	} catch (exception) {
		next(exception)
	}
})

blogsRouter.delete('/:id', async (req, res, next) => {
	try {
		const decodedToken = jwt.verify(req.token, process.env.SECRET)

		if (!req.token || !decodedToken.id) {
			return res.status(401).json({ error: 'token missing or invalid' })
		}

		const blog = await Blog.findById(req.params.id)
		//5d492c8978ffdc14e528273e <- correct id for testing
		const userid = '5d492c8978ffdc14e528273e'

		if (blog.user.toString() === decodedToken.id) {
			await Blog.findByIdAndDelete(blog.id)
			res.status(204).end()
		} else {
			return res.status(401).json({ error: 'Wrong user id trying to delete' })
		}
	} catch (exception) {
		next(exception)
	}
})

blogsRouter.put('/:id', async (req, res, next) => {
	const body = req.body
	const blog = {
		likes: body.likes
	}

	try {
		const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
			new: true
		})
		console.log('updated blog', updatedBlog)
		res.json(updatedBlog.toJSON())
	} catch (err) {
		next(err)
	}
})

module.exports = blogsRouter
