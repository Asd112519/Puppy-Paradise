import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const breeds = [
  {
    id: "golden-retriever",
    name: "Golden Retriever",
    image: "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvd2s2MTA5MzYwNS1pbWFnZS1rcDZjYjE0dC5qcGc.jpg",
    description: "Known for their friendly and tolerant attitude, they are one of the most popular family pets.",
  },
  {
    id: "german-shepherd",
    name: "German Shepherd",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR91Z8tX1iklbaxS-Bn2iQl65lBbTJCUU4e3A&s",
    description: "Intelligent, courageous, and loyal, often used as police and military dogs.",
  },
  {
    id: "labrador-retriever",
    name: "Labrador Retriever",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzoNna54XugRGvi1qdFzJyiRX218L60kIJig&s",
    description: "Active, outgoing, and known for their cheerful demeanor and love of fetching.",
  },
  {
    id: "wheaten-terrier",
    name: "Wheaten Terrier",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMhquhsGkDycg260SLHxDDCbLULlyjbVptCA&s",
    description: "Medium-sized, lively, and affectionate Irish farm dog recognized by its distinctive silky, wavy, wheaten-colored coat.",
  },
  {
    id: "bernese-mountain-dog",
    name: "Bernese Mountain Dog",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ROVUlfLu1BfKDNm8P-kFYEBohfBau7UhDw&s",
    description: "Gentle, good-natured, and calm, known for being a powerful worker.",
  },
  {
    id: "chihuahua",
    name: "Chihuahua",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXN5V-H0K5xF8wP9M7Q2L1R6S3T4U5V6W7X8&s",
    description: "Tiny but mighty, Chihuahuas are known for their bold personality and affectionate nature despite their small size.",
  },
];

const facts = [
  { fact: "Fact 1", text: "A dog's nose print is unique, much like a human's fingerprint." },
  { fact: "Fact 2", text: "The Basenji is the only dog that cannot bark, but it can yodel!" },
  { fact: "Fact 3", text: "Dogs have three eyelids, one of which is a membrane that keeps the eye lubricated and protected." },
  { fact: "Fact 4", text: "A dog's sense of smell is 1,000 to 10,000 times stronger than a human's." },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-green-100 dark:bg-gray-900 py-16 md:py-24 text-center transition duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4" style={{ fontFamily: "'Pacifico', cursive" }}>
            Welcome to the Puppy Paradise!
          </h2>
          <p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Comic Sans MS', sans-serif" }}>
            Discover a world of furry friends and everything you need to know about them.
          </p>
          <a
            href="#breeds"
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-blue-600 hover:to-green-500 transition-transform transform hover:scale-110 inline-block"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Explore the Popular dog Breeds
          </a>
        </div>
      </section>

      {/* Breeds Section */}
      <section id="breeds" className="py-16 bg-white dark:bg-gray-800 transition duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            Popular Dog Breeds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {breeds.map((breed) => (
              <Link
                key={breed.id}
                to={`/breed/${breed.id}`}
                className="bg-white dark:bg-gray-700 text-black dark:text-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 block"
              >
                <img src={breed.image} alt={breed.name} className="w-full h-48 object-cover" />
                <div className="p-6" style={{ fontFamily: "'Comic Sans MS', sans-serif" }}>
                  <h3 className="text-2xl font-bold mb-2">{breed.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{breed.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section id="facts" className="bg-gradient-to-r from-green-400 to-blue-600 py-16 transition duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            Fun Dog Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facts.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transform hover:scale-105 transition duration-300 text-black dark:text-white"
                style={{ fontFamily: "'Comic Sans MS', sans-serif" }}
              >
                <p className="text-lg leading-relaxed">
                  <span className="text-gray-600 dark:text-gray-300 font-bold text-2xl">{item.fact}:</span> {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8 font-bold">
            <Link
              to="/more-facts"
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-500 hover:to-green-500 transition-transform transform hover:scale-105"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              More Fun Facts!
            </Link>
          </div>
        </div>
      </section>

      {/* Adoption Section */}
      <section id="adopt-section" className="py-16 bg-white dark:bg-gray-800 transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            Looking for a new friend?
          </h2>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            There are countless dogs in shelters waiting for a loving home. Consider adopting one today and using these tips and tricks!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/adopt"
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-500 hover:to-green-500 transition-transform transform hover:scale-105"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Learn more!
            </Link>
            <Link
              to="/care"
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-500 hover:to-green-500 transition-transform transform hover:scale-105"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              How to care for a dog
            </Link>
          </div>
        </div>
      </section>

      {/* Interview Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 text-center transition duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            An Interview with a Dog
          </h2>
          <p className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-300">Here is an interview of a three-year-old dog named Penny.</p>
          <div className="flex justify-center">
            <Link
              to="/interview"
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-500 hover:to-green-500 transition-transform transform hover:scale-105"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              What does Penny have to say?
            </Link>
          </div>
        </div>
      </section>

      {/* Game Joint Section */}
      <section id="games" className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🎮 Game Joint 🎮
          </h2>
          <p className="text-xl text-white opacity-95 mb-12 max-w-3xl mx-auto">
            Prepare for interactive fun! We have Block Blast and more games coming soon. Step into the Game Joint and start playing now!
          </p>
          <Link
            to="/games"
            className="bg-white text-purple-600 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-purple-100 transition-transform transform hover:scale-110 inline-block"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Enter Game Joint
          </Link>
        </div>
      </section>

      {/* Future Updates Section */}
      <section className="bg-gradient-to-br from-blue-400 to-indigo-600 py-16 text-center transition duration-300">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>What's Next in Puppy Paradise?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            We're constantly working to bring you more fun and features. Our next major update is coming soon!
          </p>
        </div>
      </section>
    </Layout>
  );
}
