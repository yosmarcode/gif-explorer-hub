import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-8xl mb-6">🎭</div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-8">¡Oops! Esta página no existe</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-primary text-white hover:shadow-glow transition-all duration-300"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
