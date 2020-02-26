export const shorten = (s: string, n: number) => {
  if (s.length < n) {
    return s;
  } else {
    return s.substr(0, n - 3) + '...';
  }
};
