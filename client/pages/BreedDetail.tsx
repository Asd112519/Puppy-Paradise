import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";

const breedDetails: Record<
  string,
  {
    title: string;
    bgColor: string;
    details: Array<{ heading: string; text: string }>;
  }
> = {
  "golden-retriever": {
    title: "All About Golden Retrievers",
    bgColor: "bg-yellow-100 dark:bg-gray-900",
    details: [
      {
        heading: "Temperament",
        text: "Golden Retrievers are known for being friendly, intelligent, and devoted. They are patient with children and get along well with other pets.",
      },
      {
        heading: "Exercise Needs",
        text: "These dogs are very active and need plenty of exercise. They love to play fetch, swim, and go on long walks or runs.",
      },
      {
        heading: "Training and Intelligence",
        text: "Golden Retrievers are one of the easiest breeds to train because they are eager to please and very smart. They excel at obedience and agility.",
      },
    ],
  },
  "german-shepherd": {
    title: "All About German Shepherds",
    bgColor: "bg-gray-100 dark:bg-gray-900",
    details: [
      {
        heading: "Temperament",
        text: "German Shepherds are highly intelligent and often used for police and military work. They are confident, eager to please, and form strong bonds with their families.",
      },
      {
        heading: "Exercise Needs",
        text: "This breed requires a lot of physical and mental stimulation. They thrive on activities like agility training, herding, and long daily walks.",
      },
      {
        heading: "Training and Socialization",
        text: "Early socialization and consistent training are key to raising a well-behaved German Shepherd. Their intelligence makes them easy to train, but they need a firm, consistent owner.",
      },
    ],
  },
  "labrador-retriever": {
    title: "All About Labrador Retrievers",
    bgColor: "bg-amber-100 dark:bg-gray-900",
    details: [
      {
        heading: "Temperament",
        text: "Labs are outgoing, good-natured, and great with children. They are known for their cheerful demeanor and their loyalty to their family.",
      },
      {
        heading: "Exercise Needs",
        text: "This breed is very active and needs daily exercise, including walks, games of fetch, and swimming. They have a lot of energy to burn!",
      },
      {
        heading: "Training and Intelligence",
        text: "Labrador Retrievers are highly intelligent and eager to please, which makes them easy to train. They often serve as service animals, search-and-rescue dogs, and therapy dogs.",
      },
    ],
  },
  "wheaten-terrier": {
    title: "All About Wheaten Terriers",
    bgColor: "bg-orange-100 dark:bg-gray-900",
    details: [
      {
        heading: "Temperament",
        text: 'Wheatens are happy, playful, and devoted to their families. They are known for their "Wheaten greetin," a joyful leap when they welcome people.',
      },
      {
        heading: "Exercise Needs",
        text: "As a terrier breed, they are energetic and require daily exercise. They enjoy playing games, going on walks, and having space to run.",
      },
      {
        heading: "Training and Grooming",
        text: "They are intelligent and can be trained, but their independent nature requires patience and consistency. Their silky, non-shedding coat needs regular brushing to prevent mats.",
      },
    ],
  },
  "bernese-mountain-dog": {
    title: "All About Bernese Mountain Dogs",
    bgColor: "bg-gray-200 dark:bg-gray-900",
    details: [
      {
        heading: "Temperament",
        text: "They are good-natured, calm, and friendly dogs. They are very loyal and form strong bonds with their families, including children.",
      },
      {
        heading: "Exercise Needs",
        text: "Despite their size, they have moderate exercise needs. Daily walks and some playtime are usually enough to keep them happy and healthy.",
      },
      {
        heading: "Training and Care",
        text: "Bernese Mountain Dogs are intelligent and eager to please, which makes them easy to train. Their thick, double coat requires regular brushing to prevent mats and reduce shedding.",
      },
    ],
  },
  chihuahua: {
    title: "All About Chihuahuas",
    bgColor: "bg-pink-100 dark:bg-gray-900",
    details: [
      {
        heading: "Temperament",
        text: "Chihuahuas are bold, confident, and affectionate despite their tiny size. They are extremely loyal to their owners and love being the center of attention. They can be sassy and have big personalities!",
      },
      {
        heading: "Exercise Needs",
        text: "Although small, Chihuahuas are quite active and energetic. Short walks, playtime indoors, and interactive games are usually sufficient to keep them exercised and happy.",
      },
      {
        heading: "Training and Care",
        text: "Chihuahuas are intelligent but can be stubborn, requiring patient and consistent training. Their small size makes them perfect for apartment living, and they need regular dental care due to their small jaws.",
      },
    ],
  },
};

export default function BreedDetail() {
  const { id } = useParams<{ id: string }>();
  const breed = id ? breedDetails[id] : null;

  if (!breed) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Breed not found</h1>
            <Link
              to="/"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section
        className={`${breed.bgColor} py-16 min-h-screen flex items-center justify-center transition duration-300`}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-4xl font-bold mb-6 text-gray-900 dark:text-white"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            {breed.title}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-left max-w-3xl mx-auto text-black dark:text-white">
            {breed.details.map((detail, idx) => (
              <div key={idx} className="mb-6">
                <h3
                  className="font-bold text-xl text-gray-600 dark:text-gray-300 mb-2"
                  style={{ fontFamily: "'Pacifico', cursive" }}
                >
                  {detail.heading}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {detail.text}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/"
            className="mt-8 bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 inline-block"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            Go Back
          </Link>
        </div>
      </section>
    </Layout>
  );
}
