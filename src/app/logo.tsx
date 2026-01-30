export function Logo() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="mango-gradient" cx="0.4" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#FDD835" />
          <stop offset="70%" stopColor="#FB8C00" />
          <stop offset="100%" stopColor="#E53935" />
        </radialGradient>
      </defs>
      <g transform="rotate(15 50 50)">
        <path 
          d="M 50,10 C 80,10 95,40 90,65 C 85,90 65,100 45,95 C 25,90 5,75 10,50 C 15,25 20,10 50,10 Z" 
          fill="url(#mango-gradient)"
        />
        <path 
          d="M 45,18 C 65,0 85,10 80,25 C 70,22 60,22 45,18 Z" 
          fill="#43A047"
        />
        <path 
          d="M 62,12 C 68,15 72,20 70,22" 
          stroke="#2E7D32" 
          strokeWidth="1.5" 
          fill="none"
        />
      </g>
    </svg>
  );
}
