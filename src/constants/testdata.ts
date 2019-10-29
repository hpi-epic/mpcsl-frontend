export const graph = {
  nodes: [
    { id: 0, label: 'a' },
    { id: 1, label: 'b' },
    { id: 2, label: 'c' },
    { id: 3, label: 'd' },
    { id: 4, label: 'e' },
    { id: 5, label: 'f' },
    { id: 6, label: 'g' },
    { id: 7, label: 'h' },
    { id: 8, label: 'i' },
    { id: 9, label: 'j' }
  ],
  links: [
    { source: 1, target: 2 },
    { source: 1, target: 4 },
    { source: 1, target: 8 },
    { source: 2, target: 4 },
    { source: 2, target: 9 },
    { source: 3, target: 6 },
    { source: 3, target: 8 },
    { source: 4, target: 5 },
    { source: 5, target: 8 },
    { source: 7, target: 8 }
  ]
};
