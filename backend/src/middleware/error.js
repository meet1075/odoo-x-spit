export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error for debugging
  console.error('=========================================')
  console.error('❌ ERROR HANDLER CAUGHT ERROR')
  console.error('=========================================')
  console.error('Request:', req.method, req.originalUrl)
  console.error('Error Type:', err.name)
  console.error('Error Message:', err.message)
  console.error('Error Code:', err.code)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found'
    error.message = message
    error.statusCode = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    error.message = message
    error.statusCode = 400
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    console.error('Validation Errors Details:')
    Object.keys(err.errors).forEach(key => {
      console.error(`  ❌ Field: ${key}`)
      console.error(`     Message: ${err.errors[key].message}`)
      console.error(`     Value: ${err.errors[key].value}`)
      console.error(`     Kind: ${err.errors[key].kind}`)
    })
    const message = Object.values(err.errors).map(val => val.message).join(', ')
    error.message = message
    error.statusCode = 400
    error.errors = err.errors // Include detailed errors
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token'
    error.message = message
    error.statusCode = 401
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired'
    error.message = message
    error.statusCode = 401
  }

  console.error('Response Status:', error.statusCode || 500)
  console.error('=========================================')

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}
