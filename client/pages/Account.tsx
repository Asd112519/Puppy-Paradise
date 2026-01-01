import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

export default function Account() {
  const [isDark, setIsDark] = useState(false);
  const [userId, setUserId] = useState("user-123");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved === "dark");
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
    <Layout>
      <section className="bg-white dark:bg-gray-800 py-16 min-h-screen flex items-center justify-center transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            Puppy Account Management & Settings
          </h2>
          <div className="p-8 rounded-xl shadow-2xl max-w-xl mx-auto bg-gray-100 dark:bg-gray-900 transition duration-300">
            <p className="text-xl font-bold text-green-600 dark:text-green-300 mb-4">Your Session Status</p>
            <div className="mb-4">
              <p className="text-sm break-all text-black dark:text-gray-300">
                Current User ID (UID): <span className="font-mono font-semibold text-gray-800 dark:text-white">{userId}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">You are currently signed in anonymously.</p>
            </div>

            <button
              onClick={() => {
                setUserId("user-" + Math.random().toString(36).substr(2, 9));
                alert("You have been signed out. A new anonymous session has been started.");
              }}
              className="mt-4 bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow hover:bg-red-600 transition"
            >
              Sign Out (and Start New Anonymous Session)
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mt-12 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-2xl mx-auto transition duration-300">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl text-green-600 dark:text-green-300" style={{ fontFamily: "'Pacifico', cursive" }}>
                Dark Mode
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <Link
            to="/"
            className="mt-8 bg-gray-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 inline-block"
          >
            Go Back to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
}
