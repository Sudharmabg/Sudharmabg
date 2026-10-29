// Lab: small interactive experiments on the homepage, shown as a swipeable carousel. Copy only; the experiments live in Lab.jsx.
export const lab = {
  intro: 'Small experiments in motion and interaction. Poke at them; they are built to be played with.',
  experiments: [
    {
      id: 'repel',
      title: 'Repel',
      note: 'Letters step out of the way of your pointer, each on its own spring.',
      hint: 'Move over the word',
      touchHint: 'Tap or drag the word',
      word: 'CRAFT',
    },
    {
      id: 'spring',
      title: 'Spring tuner',
      note: 'The same move with different physics. Stiffness sets the pull, damping sets the settle.',
      hint: 'Click anywhere in the box',
      touchHint: 'Tap anywhere in the box',
    },
    {
      id: 'easing',
      title: 'Easing race',
      note: 'Four curves, same distance, same start. The one that feels fastest is not the one that is.',
      hint: 'Press race',
    },
    {
      id: 'hold',
      title: 'Hold to confirm',
      note: 'For actions you cannot undo. The fill takes its time on the way in; letting go snaps it back fast.',
      hint: 'Press and hold',
    },
    {
      id: 'fling',
      title: 'Fling',
      note: 'Throw the card. A quick flick clears it, or pull it past the line and let go; a short, slow drag springs home.',
      hint: 'Drag and throw',
      touchHint: 'Throw the card',
    },
    {
      id: 'morph',
      title: 'Morphing button',
      note: 'One element through three states. It reshapes instead of swapping, so the eye never loses it.',
      hint: 'Click send',
      touchHint: 'Tap send',
    },
  ],
}
