import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const interview = [
  {
    speaker: "Interviewer",
    text: "So Penny, what's your favorite thing to do?",
    color: "text-green-600 dark:text-green-300",
  },
  {
    speaker: "Penny",
    text: "Chasing squirrels and getting belly rubs are the best!",
    color: "text-blue-600 dark:text-blue-300",
  },
  {
    speaker: "Interviewer",
    text: "That sounds like a lot of fun. What do you think about people food?",
    color: "text-green-600 dark:text-green-300",
  },
  {
    speaker: "Penny",
    text: "Delicious! Cheese is my favorite",
    color: "text-blue-600 dark:text-blue-300",
  },
  {
    speaker: "Interviewer",
    text: 'On a scale from one to ten, how excited do you get when someone says "walk."',
    color: "text-green-600 dark:text-green-300",
  },
  {
    speaker: "Penny",
    text: "1 million!!!",
    color: "text-blue-600 dark:text-blue-300",
  },
  {
    speaker: "Interviewer",
    text: "What do you think of fireworks? Pretty lights or Boom nightmares?",
    color: "text-green-600 dark:text-green-300",
  },
  {
    speaker: "Penny",
    text: "I hate fireworks! they scare me a lot! So I will go with \"Boom nightmares\".",
    color: "text-blue-600 dark:text-blue-300",
  },
  {
    speaker: "Interviewer",
    text: "Well, thank you for your time, Penny!",
    color: "text-green-600 dark:text-green-300",
  },
];

export default function Interview() {
  return (
    <Layout>
      <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen flex items-center justify-center transition duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white" style={{ fontFamily: "'Pacifico', cursive" }}>
            An Interview with Penny the Dog
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Here is a fascinating interview with a three-year-old Whoolde (Wheaten Terrier Poodle) named Penny.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-left max-w-3xl mx-auto text-black dark:text-white">
            {interview.map((line, idx) => (
              <div key={idx} className="mb-6">
                <p className={`font-bold text-xl mb-1 ${line.color}`} style={{ fontFamily: "'Pacifico', cursive" }}>
                  {line.speaker}:
                </p>
                <p className="text-gray-700 dark:text-gray-300">{line.text}</p>
              </div>
            ))}
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
