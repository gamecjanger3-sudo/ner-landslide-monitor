import React, { useState } from "react";
import { translateText } from "../services/translationService";

export const TranslatorWidget: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText) return;
    setLoading(true);
    const result = await translateText(inputText, targetLang);
    setTranslatedText(result);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 max-w-md">
      <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
        LibreTranslate Tool
      </h3>

      <textarea
        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 mb-3 text-gray-900 dark:text-white"
        rows={3}
        placeholder="Enter text to translate..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {translatedText && (
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase">Translation Result</p>
          <p className="text-gray-800 dark:text-gray-200 mt-1">{translatedText}</p>
        </div>
      )}
    </div>
  );
};