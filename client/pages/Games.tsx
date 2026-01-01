import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function GameSelection() {
  const games = [
    {
      id: "block-blast",
      name: "Block Blast",
      description: "A classic puzzle game where you arrange colorful blocks on an 8x8 grid. Complete rows and columns to earn points!",
      emoji: "🧩",
      color: "from-pink-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-pink-500",
    },
    {
      id: "fetch",
      name: "Fetch!",
      description: "Tap the ball before it leaves the screen or hits an obstacle! Test your reflexes and see how many balls you can catch!",
      emoji: "🎾",
      color: "from-green-400 to-blue-500",
      hoverColor: "hover:from-blue-500 hover:to-green-400",
    },
  ];

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition duration-300 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              🎮 Game Joint 🎮
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Pick a game and let the fun begin! More games coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <div className={`bg-gradient-to-br ${game.color} p-8 text-center`}>
                  <div className="text-6xl mb-4">{game.emoji}</div>
                  <h3 className="text-3xl font-bold text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {game.name}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                    {game.description}
                  </p>
                  <Link
                    to={`/games/${game.id}`}
                    className={`w-full block text-center bg-gradient-to-r ${game.color} ${game.hoverColor} text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110`}
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-lg"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              ← Back to Home
            </Link>
          </div>

          {/* Coming Soon Section */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              🚀 Coming Soon
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              More exciting games are being developed. Stay tuned!
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="inline-block bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                🎲 Dice Games
              </span>
              <span className="inline-block bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                🐕 Puppy Runner
              </span>
              <span className="inline-block bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                🎯 Memory Match
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
