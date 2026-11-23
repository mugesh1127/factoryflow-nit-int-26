// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  content: ['./src/**/*.{tsx,ts,js,jsx,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#0A192F', // extracted from live UI
        accent: '#00BFA6', // teal accent
        destructive: '#EF4444', // red
        warning: '#F59E0B', // orange
        background: '#F5F7FA',
        surface: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
