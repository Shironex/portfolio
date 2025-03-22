class PublicError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export { PublicError }
