const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  likes = blogs.map(item => item.likes)
  favoriteIndex = likes.indexOf(Math.max(...likes))

  return blogs[favoriteIndex]
}

const removeKeys = (obj, key) => {
  Object.keys(key).map(i =>
    obj.hasOwnProperty(key[i]) ? delete obj[key[i]] : obj
  )
}

const mostBlogs = blogs => {
  const newBlogs = blogs.map(item => Object.assign({}, item))
  const allAuthors = newBlogs.reduce((arr, item) => {
    const author = arr.find(blog => blog.author === item.author)

    const blogs = 1
    item.blogs = blogs

    author
      ? (author.blogs += item.blogs)
      : removeKeys(item, ['_id', '__v', 'url', 'likes', 'title'])
    arr.push(item)

    return arr
  }, [])

  const mostBlogs = allAuthors.reduce((sum, author) => {
    return sum.blogs > author.blogs ? sum : author
  }, 0)
  return mostBlogs
}

const mostLikes = blogs => {
  const newBlogs = blogs.map(item => Object.assign({}, item))
  const allAuthors = newBlogs.reduce((arr, item) => {
    const author = arr.find(blog => blog.author === item.author)

    author
      ? (author.likes += item.likes)
      : removeKeys(item, ['_id', '__v', 'url', 'title'])
    arr.push(item)

    return arr
  }, [])

  const mostLikes = allAuthors.reduce((sum, author) => {
    return sum.likes > author.likes ? sum : author
  }, 0)
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
