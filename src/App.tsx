import Tiptap from "./Tiptap";
import { useState } from "react";
import { ingredients } from "./data/ingredients";

export default function App() {
  const [activeIngredientId, setActiveIngredientId] = useState<string>(null);

  return (
    <PageContainer>
      <Section title="Recipe">
        <Card>
          <Tiptap setActiveIngredient={setActiveIngredientId} />
        </Card>
      </Section>
      <Section>
        {activeIngredientId && (
          <Card hasImage>
            <h2 className="text-lg">
              {ingredients.find(x => activeIngredientId === x.id).name}
            </h2>
          </Card>
        )}
      </Section>
    </PageContainer>
  );
}

function Card({ children, hasImage = false }) {
  return (
    <div className="w-full bg-white shadow">
      {hasImage && <div className="w-full h-32 bg-gray-100"></div>}
      <div className="p-4">{children}</div>
    </div>
  );
}

function PageContainer({ children }) {
  return (
    <div className="grid max-w-2xl grid-cols-2 gap-4 py-4 mx-auto">
      {children}
    </div>
  );
}

function Section({ children, title = null }) {
  return (
    <section>
      {title && <h1 className="pb-2 text-lg font-medium">{title}</h1>}
      {children}
    </section>
  );
}
