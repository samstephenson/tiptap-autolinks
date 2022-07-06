import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { AutomaticLinks } from "./AutomaticLinks";
import { ingredients } from "./data/ingredients";

export default function Tiptap({
  setActiveIngredient,
  setMatchingIngredients,
}) {
  console.log(`Loaded ${ingredients.length} ingredients`);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      AutomaticLinks.configure({
        searchResultClass:
          "underline cursor-pointer text-red-500 hover:text-red-600", // class to give to found items. default
        searchTerms: ingredients, // array of search terms to match.
        setMatchingIngredients: setMatchingIngredients,
        onClick: id => {
          setActiveIngredient(id);
        },
      }),
    ],
    content: `<p>chop carrots, shallots, garlic, and onions, and mix together with tomatoes in a bowl</p>`,
  });

  return <EditorContent editor={editor} />;
}
