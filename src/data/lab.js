// Lab: small interactive experiments on the homepage. Copy only; the experiments live in Lab.jsx.
export const lab = {
  intro: 'Small experiments in motion and interaction. Poke at them; they are built to be played with.',
  experiments: [
    {
      id: 'repel',
      title: 'Repel',
      note: 'Letters step out of the way of your pointer, each on its own spring.',
      hint: 'Move over the word',
      word: 'CRAFT',
    },
    {
      id: 'spring',
      title: 'Spring tuner',
      note: 'The same move with different physics. Stiffness sets the pull, damping sets the settle.',
      hint: 'Click anywhere in the box',
    },
    {
      id: 'easing',
      title: 'Easing race',
      note: 'Four curves, same distance, same start. The one that feels fastest is not the one that is.',
      hint: 'Press race',
    },
  ],
}
