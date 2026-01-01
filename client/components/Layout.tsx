import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="text-4xl font-extrabold tracking-tight hover:opacity-90 transition" style={{ fontFamily: "'Pacifico', cursive" }}>
            The Puppy Paradise
          </Link>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-lg font-bold">
              <li>
                <a href="/#breeds" className="hover:underline transition duration-300">
                  Breeds
                </a>
              </li>
              <li>
                <a href="/#facts" className="hover:underline transition duration-300">
                  Fun Facts
                </a>
              </li>
              <li>
                <a href="/#adopt-section" className="hover:underline transition duration-300">
                  Adopt
                </a>
              </li>
              <li>
                <Link to="/care" className="hover:underline transition duration-300">
                  Care
                </Link>
              </li>
              <li>
                <Link to="/interview" className="hover:underline transition duration-300">
                  Interview
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-5">
        <div className="container mx-auto px-10 text-center font-bold">
          <p style={{ fontFamily: "'Fredoka', sans-serif" }}>
            &copy; 2024 The Puppy Paradise. All rights reserved. |{" "}
            <Link to="/account" className="hover:underline transition duration-300 font-bold text-white">
              Settings
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
