import React, { useState, useEffect } from "react";

const questions = [
  {
    question: "How often does your skin feel oily?",
    options: [
      { text: "Rarely or never", type: "Dry" },
      { text: "Sometimes, mainly in T-zone", type: "Combination" },
      { text: "Often or always", type: "Oily" },
      { text: "Rarely oily or dry", type: "Normal" },
    ],
  },
  {
    question: "How does your skin feel after cleansing?",
    options: [
      { text: "Tight and dry", type: "Dry" },
      { text: "Some areas dry, others oily", type: "Combination" },
      { text: "Still oily", type: "Oily" },
      { text: "Balanced and comfortable", type: "Normal" },
    ],
  },
  {
    question: "How visible are your pores?",
    options: [
      { text: "Small or invisible", type: "Dry" },
      { text: "Visible in T-zone", type: "Combination" },
      { text: "Large and visible", type: "Oily" },
      { text: "Small and not very visible", type: "Normal" },
    ],
  },
  {
    question: "How often does your skin feel flaky?",
    options: [
      { text: "Often", type: "Dry" },
      { text: "Sometimes", type: "Combination" },
      { text: "Rarely", type: "Oily" },
      { text: "Never", type: "Normal" },
    ],
  },
];

const productRecommendations = {
  Dry: ["Moisturizer", "Hydrating Serum", "Gentle Cleanser"],
  Oily: ["Oil-Control Cleanser", "Mattifying Moisturizer", "Clay Mask"],
  Combination: ["Balancing Toner", "Lightweight Moisturizer", "Foaming Cleanser"],
  Normal: ["Daily Cleanser", "Light Moisturizer", "Sunscreen"],
};

export default function GlowTest() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Fetch products to match recommendation names
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/products")
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleOptionChange = (qIndex, optionType) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionType;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answers.includes(null)) {
      alert("Please answer all questions.");
      return;
    }

    // Count points for each skin type
    const scores = answers.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Find the skin type with highest score
    let maxScore = 0;
    let skinType = null;
    for (const [type, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        skinType = type;
      }
    }

    setResult(skinType);

    // Find recommended products matching the recommended names
    const recommendedNames = productRecommendations[skinType] || [];
    const recommended = allProducts.filter((p) =>
      recommendedNames.some((name) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      )
    );

    setRecommendedProducts(recommended);
  };

  return (
    <div className="auth-container" style={{ maxWidth: "600px" }}>
      <h2 className="auth-title">Glow Test</h2>
      {!result ? (
        <form onSubmit={handleSubmit}>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontWeight: "600" }}>{q.question}</p>
              {q.options.map((opt, idx) => (
                <label key={idx} style={{ display: "block", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={opt.type}
                    checked={answers[i] === opt.type}
                    onChange={() => handleOptionChange(i, opt.type)}
                    required
                  />{" "}
                  {opt.text}
                </label>
              ))}
            </div>
          ))}

          <button className="auth-btn" type="submit">
            See My Skin Type
          </button>
        </form>
      ) : (
        <div>
          <h3>Your skin type is: <span style={{ color: "#5b4034" }}>{result}</span></h3>

          <h4>Recommended Products:</h4>
          {recommendedProducts.length === 0 ? (
            <p>No product recommendations found.</p>
          ) : (
            <ul>
              {recommendedProducts.map((product) => (
                <li key={product.id}>
                  <strong>{product.name}</strong> - {product.price} EGP
                </li>
              ))}
            </ul>
          )}

          <button
            className="auth-btn"
            onClick={() => {
              setResult(null);
              setAnswers(Array(questions.length).fill(null));
              setRecommendedProducts([]);
            }}
          >
            Retake Test
          </button>
        </div>
      )}
    </div>
  );
}
