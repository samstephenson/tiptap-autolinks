import Tiptap from "./Tiptap";
import { useState } from "react";
import { ingredients } from "./data/ingredients";

export default function App() {
  const [activeIngredientId, setActiveIngredientId] = useState<string>(null);

  return (
    <PageContainer>
      <Section>
        <div className="p-8 bg-white shadow-xl">
          <Tiptap setActiveIngredient={setActiveIngredientId} />
        </div>
      </Section>
      <div className="p-4">
        {activeIngredientId && (
          <Card hasImage>
            <h2 className="text-lg">
              {ingredients.find(x => activeIngredientId === x.id).name}
            </h2>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

function Card({ children, hasImage = false }) {
  return (
    <div className="w-full max-w-xs bg-white shadow">
      {hasImage && <div className="w-full h-32 bg-gray-300"></div>}
      <div className="p-4">{children}</div>
    </div>
  );
}

function PageContainer({ children }) {
  return (
    <div className="grid h-screen grid-cols-2 gap-4 mx-auto">{children}</div>
  );
}

function Section({ children }) {
  return (
    <section className="overflow-x-visible overflow-y-scroll">
      {children}
    </section>
  );
}
