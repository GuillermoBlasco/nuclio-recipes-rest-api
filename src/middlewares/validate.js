function validate(validateFn) {
  return (req, res, next) => {
    const { error, value } = validateFn(req.body)
    if (error) {
      res.status(400).json({ error: error.message })
    } else {
      req.body = value
      next()
    }
  }
}

module.exports = validate
