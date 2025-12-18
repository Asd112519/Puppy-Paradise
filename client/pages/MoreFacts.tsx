import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const moreFacts = [
  { fact: "Fact 5", text: "A Border Collie named Chaser knew over 1,000 words and could identify different toys by name!" },
  { fact: "Fact 6", text: "Dogs can get jealous, just like people, when their owners pay attention to other pets or people." },
  { fact: "Fact 7", text: "The Beatles song \"A Day in the Life\" has a frequency that only dogs can hear, recorded by Paul McCartney for his dog." },
  { fact: "Fact 8", text: "The world's oldest dog, an Australian cattle dog named Bluey, lived to be 29 years old!" },
];

export default function MoreFacts() {
  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen flex items-center justify-center transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            Even More Fun Dog Facts!
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-left max-w-3xl mx-auto text-black dark:text-white">
            {moreFacts.map((item, idx) => (
              <div key={idx} className="mb-6">
                <p className="text-lg leading-relaxed">
                  <span className="text-gray-600 dark:text-gray-300 font-bold text-2xl">{item.fact}:</span> {item.text}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/"
            className="mt-8 bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 inline-block"
          >
            Go Back
          </Link>
        </div>
      </section>
    </Layout>
  );
}
