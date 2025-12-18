import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function DogCare() {
  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen flex items-center justify-center transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            How to Care for Your Dog
          </h2>
          <p className="text-lg text-blue-700 dark:text-blue-300 mb-8 max-w-3xl mx-auto">
            Bringing a new dog home is exciting! Here are some tips to help your new friend feel safe and happy.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-left max-w-3xl mx-auto text-black dark:text-white">
            <div className="mb-6">
              <h3 className="font-bold text-xl text-green-600 dark:text-green-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Feeding and Nutrition
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Provide clean, fresh water and high-quality dog food. Your vet can recommend the best food for your dog's age and breed.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-xl text-green-600 dark:text-green-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Exercise and Play
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Dogs need daily exercise to stay healthy and happy. This can be walks, playing fetch, or running in a fenced-in yard.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-bold text-xl text-green-600 dark:text-green-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Grooming
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Regular grooming, like brushing and bathing, keeps their coat healthy. Don't forget to trim their nails and brush their teeth!
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl text-green-600 dark:text-green-300 mb-2" style={{ fontFamily: "'Pacifico', cursive" }}>
                Lots of Love
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                The most important part of dog care is giving them plenty of affection, cuddles, and attention! They are part of the family.
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="mt-8 bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 inline-block"
          >
            Exit
          </Link>
        </div>
      </section>
    </Layout>
  );
}
