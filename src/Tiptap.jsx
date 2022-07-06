import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { AutomaticLinks } from "./AutomaticLinks";
import { ingredients } from "./data/ingredients";

export default function Tiptap({ setActiveIngredient }) {
  //   console.log(`Loaded ${ingredients.length} ingredients`);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: `focus:outline-none`,
      },
    },
    extensions: [
      Document,
      Paragraph,
      Text,
      AutomaticLinks.configure({
        searchResultClass: " cursor-pointer text-red-500 hover:text-red-600",
        searchTerms: ingredients,
        onClick: id => {
          setActiveIngredient(id);
        },
      }),
    ],
    content: `<p>Chop carrots, shallots, garlic, and onions, and mix together with tomatoes in a bowl. Add lemon, spinach, kale and mushrooms for some zing!</p>`,
  });

  return <EditorContent editor={editor} />;
}
