
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css' // This already includes Tailwind and global styles

createRoot(document.getElementById("root")!).render(<App />);
