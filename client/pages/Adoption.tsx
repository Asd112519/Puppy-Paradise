import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function Adoption() {
  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen flex items-center justify-center transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            Ready to Adopt?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Adopting a dog from a shelter is a wonderful and rewarding experience. Here's a guide to get you started.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-left max-w-3xl mx-auto text-black dark:text-white">
            <div className="mb-6">
              <h3 className="font-bold text-xl text-gray-600 dark:text-gray-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Finding Your New Friend
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Start by visiting local animal shelters or rescue organizations. Websites like Petfinder or Adopt-a-Pet can also help you search for dogs in your area.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-xl text-gray-600 dark:text-gray-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                The Adoption Process
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Most shelters require you to fill out an application. This helps them ensure the dog is going to a safe and suitable home. Be prepared for a potential home visit or a virtual interview.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-xl text-gray-600 dark:text-gray-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Bringing Them Home
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Have your home prepared with food, water bowls, a collar, leash, and a comfortable bed. Give your new dog a calm, quiet space to decompress and adjust to their new environment.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-600 dark:text-gray-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Be Patient and Loving
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                It can take time for an adopted dog to feel comfortable and show their true personality. Be patient, provide lots of love, and they will soon be a happy part of your family.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="mt-8 bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 inline-block"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Exit
          </Link>
        </div>
      </section>
    </Layout>
  );
}
