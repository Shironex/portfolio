class PublicError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export { PublicError }
