export const handleAuthError = (error, navigate) => {
  if (
    error.response &&
    (error.response.status === 401 || error.response.status === 403)
  ) {
    localStorage.clear()
    navigate('/')
    return true
  }

  return false
}