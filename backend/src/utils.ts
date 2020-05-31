export const strIsEmpty = (x: string) => {
  return (
    typeof x === 'undefined' ||
    x === null ||
    x.length === 0 ||
    x === '' ||
    x.replace(/\s/g, '') === '' ||
    !/[^\s]/.test(x) ||
    /^\s*$/.test(x)
  )
}

export const strIsNotEmpty = (x: string) => {
  return !strIsEmpty(x)
}
