let atob = typeof window === 'undefined'
? v => new Buffer(v, 'base64').toString('binary')
: window.atob

export function decodeJwt (token) {
  if (!token) return undefined

  const [header, claims, signature] = token.split('.')
  try {
    return {
      header: JSON.parse(atob(header)),
      claims: JSON.parse(atob(claims)),
      signature: atob(signature)
    }
  } catch (e) { console.log(e) }
  return undefined
}
