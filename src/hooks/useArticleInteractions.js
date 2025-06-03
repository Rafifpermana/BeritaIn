// src/hooks/useArticleInteractions.js
import { useContext } from "react";
import { ArticleInteractionContext } from "../contexts/ArticleInteractionContextDefinition";

export const useArticleInteractions = () => {
  // Pastikan diekspor dengan nama ini
  const context = useContext(ArticleInteractionContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useArticleInteractions must be used within an ArticleInteractionProvider"
    );
  }
  return context;
};
