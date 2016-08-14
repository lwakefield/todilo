import atob from 'atob'

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
