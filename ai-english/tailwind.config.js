/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['selector', '[theme="dark"]'],
  theme: {
    extend: {
      colors: {
        title: 'var(--title)',
        content: 'var(--content)',
        active: 'var(--active)',
        'button-primary-bg': 'var(--button-primary-bg)',
        'button-primary-text': 'var(--button-primary-text)',
        'accent-text': 'var(--accent-text)',
        'card-bg': 'var(--card-bg)',
        'dialog-bg':'var(--dialog-bg)',
        'border-primary-1':'var(--border-primary-1)',
        'plain-color':'var(--plain-color)',
        'button-accent-color':'var(--button-accent-color)',
        'accent-bg':'var(--accent-bg)',
        'accent-active-bg':'var(--accent-active-bg)',
        'translate-card-bg':'var(--translate-card-bg)',
      },
      fontFamily: {
        shuhei: 'AlimamaShuHeiTi',
        deyi: 'SmileySans-Oblique'
      },
      boxShadow:{
        'voice-dialog-shadow-light':'inset 0px 10px 15px -3px rgba(0,0,0,0.1),inset 0px -10px 15px -3px rgba(0,0,0,0.1);',
        'voice-dialog-shadow-dark':'inset 0px 10px 15px -3px rgba(255,255,255,0.3),inset 0px -10px 15px -3px rgba(255,255,255,0.3);',
        'dialog-shadow-light':'0px 1px 2px 0px #0ea5e966',
        'dialog-shadow-dark':'inset 0px 10px 15px -3px rgba(255,255,255,0.3),inset 0px -10px 15px -3px rgba(255,255,255,0.3),0px 0px 10px 0px #0ea5e9',
      }
    }
  },
  plugins: []
}
