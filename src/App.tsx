import Tiptap from "./Tiptap";
import { useState } from "react";
import { ingredients, Ingredient } from "./data/ingredients";

export default function App() {
  const [matchingIngredients, setMatchingIngredients] = useState<Ingredient[]>(
    ingredients.slice(0, 10)
  );
  const [activeIngredient, setActiveIngredient] = useState<string>(null);

  return (
    <PageContainer>
      <Section title="Recipe">
        <Card>
          <Tiptap
            setActiveIngredient={setActiveIngredient}
            setMatchingIngredients={x => {
              console.log("Trying to set ingreds");
              setMatchingIngredients(x);
            }}
          />
        </Card>
      </Section>
      <Section title="Matching ingredients">
        <WrappingList>
          {matchingIngredients.map((ingredient: Ingredient) => (
            <Chip
              key={ingredient.id}
              text={ingredient.name}
              isActive={activeIngredient === ingredient.id}
            />
          ))}
        </WrappingList>
      </Section>
    </PageContainer>
  );
}

function Card({ children }) {
  return <div className="p-4 bg-white shadow">{children}</div>;
}

function WrappingList({ children }) {
  return <div className="flex flex-wrap gap-1">{children}</div>;
}

function PageContainer({ children }) {
  return (
    <div className="flex flex-col max-w-lg py-4 mx-auto space-y-8">
      {children}
    </div>
  );
}

function Section({ children, title }) {
  return (
    <section>
      <h1 className="pb-2 text-lg font-medium">{title}</h1>
      {children}
    </section>
  );
}

function Chip({ isActive, text }) {
  return (
    <span
      className={`px-1.5 ${
        isActive ? "bg-red-500 text-white" : "bg-gray-200"
      } rounded`}
    >
      {text}
    </span>
  );
}
