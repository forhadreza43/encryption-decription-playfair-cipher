import React, { useState } from "react";
import "./App.css";
import { ClipboardCopy, Copy } from "lucide-react";

const removeDuplicates = (str) => {
  return [...new Set(str.replace(/J/g, 'I').toUpperCase())].join("");
};

const generateMatrix = (key) => {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  let filteredKey = removeDuplicates(key);
  let matrixString = filteredKey + [...alphabet].filter(c => !filteredKey.includes(c)).join("");

  const matrix = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(matrixString.slice(i * 5, i * 5 + 5).split(""));
  }
  return matrix;
};

const prepareText = (text) => {
  text = text.replace(/J/g, 'I').toUpperCase().replace(/[^A-Z]/g, "");
  let prepared = "";
  for (let i = 0; i < text.length; i += 2) {
    let a = text[i];
    let b = text[i + 1] || "X";
    if (a === b) {
      b = "X";
      i--;
    }
    prepared += a + b;
  }
  return prepared;
};

const findPosition = (matrix, char) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) return [i, j];
    }
  }
  return null;
};

const processPair = (a, b, matrix, mode) => {
  const [row1, col1] = findPosition(matrix, a);
  const [row2, col2] = findPosition(matrix, b);

  if (row1 === row2) {
    return matrix[row1][(col1 + (mode === 'encrypt' ? 1 : 4)) % 5] + matrix[row2][(col2 + (mode === 'encrypt' ? 1 : 4)) % 5];
  } else if (col1 === col2) {
    return matrix[(row1 + (mode === 'encrypt' ? 1 : 4)) % 5][col1] + matrix[(row2 + (mode === 'encrypt' ? 1 : 4)) % 5][col2];
  } else {
    return matrix[row1][col2] + matrix[row2][col1];
  }
};

const removeFillerX = (text) => {
  let result = "";
  for (let i = 0; i < text.length; i += 2) {
    let a = text[i];
    let b = text[i + 1];
    if (b === "X" && (i + 2 >= text.length || text[i] === text[i + 2])) {
      result += a;
    } else {
      result += a + (b || "");
    }
  }
  return result;
};

const playfairCipher = (text, key, mode = 'encrypt') => {
  const matrix = generateMatrix(key);
  const preparedText = mode === 'encrypt' ? prepareText(text) : text.toUpperCase().replace(/[^A-Z]/g, "");
  let result = "";
  for (let i = 0; i < preparedText.length; i += 2) {
    result += processPair(preparedText[i], preparedText[i + 1], matrix, mode);
  }
  return mode === 'decrypt' ? removeFillerX(result) : result;
};

export default function PlayfairCipherTool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState("encrypt");
  const defaultKey = "MONARCHY";

  const handleProcess = () => {
    setOutputText(playfairCipher(inputText, defaultKey, mode));
  };

    const handleCopy = () => {
      navigator.clipboard.writeText(outputText);
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-100 to-purple-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Playfair Cipher Tool
        </h1>

        <div className="mb-6">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {mode === "encrypt" ? "Plaintext Message" : "Ciphertext Message"}
          </label>
          <textarea
            id="message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === "encrypt"
                ? "Enter plaintext (spaces allowed)..."
                : "Enter ciphertext (spaces ignored during decryption)..."
            }
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
          ></textarea>
        </div>

        <div className="mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Mode
          </span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="encrypt"
                checked={mode === "encrypt"}
                onChange={() => {
                  setMode("encrypt");
                  setOutputText("");
                }}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Encrypt</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="mode"
                value="decrypt"
                checked={mode === "decrypt"}
                onChange={() => {
                  setMode("decrypt");
                  setOutputText("");
                }}
                className="form-radio h-4 w-4 text-pink-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-gray-700">Decrypt</span>
            </label>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleProcess}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            {mode === "encrypt" ? "Encrypt Message" : "Decrypt Message"}
          </button>
        </div>

        {(
          <div className="mb-6 relative">
            <label
              htmlFor="output"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Result
            </label>
            <button
              onClick={handleCopy}
              title="Copy to clipboard"
              className="text-gray-600 hover:text-indigo-600 absolute top-10 right-2"
            >
              <Copy className="w-5 h-5" />
            </button>
            <textarea
              id="output"
              value={outputText}
              readOnly
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
              aria-label="Cipher Result"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}