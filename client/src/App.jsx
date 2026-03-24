import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const BOARD_SIZE = 15;

const PRODUCTS = [
  {
    id: 1,
    name: "Hydra Bottle",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=700&q=80",
    details:
      "Double-wall insulated steel bottle made for gym and hiking.",
    howToUse:
      "Rinse before first use. Fill with cold or hot drinks, then close tightly.",
    stock: 12,
  },
  {
    id: 2,
    name: "Desk Lamp",
    price: 39.5,
    image:
      "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=700&q=80",
    details: "Adjustable LED desk lamp with three brightness levels.",
    howToUse:
      "Plug in with USB-C and tap the touch button to cycle brightness modes.",
    stock: 0,
  },
  {
    id: 3,
    name: "Travel Backpack",
    price: 59.0,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80",
    details: "Water-resistant backpack with laptop sleeve and side pockets.",
    howToUse:
      "Use front compartment for small items and padded sleeve for laptops up to 15 inches.",
    stock: 6,
  },
];

function randomFood(snake) {
  let position = { x: 7, y: 7 };
  do {
    position = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some((cell) => cell.x === position.x && cell.y === position.y));
  return position;
}

function SnakeGame() {
  const [snake, setSnake] = useState([
    { x: 6, y: 7 },
    { x: 5, y: 7 },
    { x: 4, y: 7 },
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 10, y: 10 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key;
      if (key === "ArrowUp" && direction.y !== 1) setDirection({ x: 0, y: -1 });
      if (key === "ArrowDown" && direction.y !== -1) setDirection({ x: 0, y: 1 });
      if (key === "ArrowLeft" && direction.x !== 1) setDirection({ x: -1, y: 0 });
      if (key === "ArrowRight" && direction.x !== -1) setDirection({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setSnake((current) => {
        const head = current[0];
        const nextHead = { x: head.x + direction.x, y: head.y + direction.y };

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= BOARD_SIZE ||
          nextHead.y >= BOARD_SIZE;
        const hitSelf = current.some(
          (part) => part.x === nextHead.x && part.y === nextHead.y,
        );

        if (hitWall || hitSelf) {
          setIsGameOver(true);
          return current;
        }

        const nextSnake = [nextHead, ...current];
        if (nextHead.x === food.x && nextHead.y === food.y) {
          setScore((prev) => prev + 1);
          setFood(randomFood(nextSnake));
        } else {
          nextSnake.pop();
        }
        return nextSnake;
      });
    }, 140);

    return () => clearInterval(timer);
  }, [direction, food, isGameOver]);

  const cells = useMemo(() => {
    const snakeSet = new Set(snake.map((part) => `${part.x}-${part.y}`));
    return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
      const x = i % BOARD_SIZE;
      const y = Math.floor(i / BOARD_SIZE);
      const key = `${x}-${y}`;
      const isSnake = snakeSet.has(key);
      const isFood = food.x === x && food.y === y;
      return (
        <div
          key={key}
          className={`cell${isSnake ? " snake" : ""}${isFood ? " food" : ""}`}
        />
      );
    });
  }, [snake, food]);

  const reset = () => {
    const initialSnake = [
      { x: 6, y: 7 },
      { x: 5, y: 7 },
      { x: 4, y: 7 },
    ];
    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setFood(randomFood(initialSnake));
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <section className="tab-content">
      <h2>Snake Game</h2>
      <p className="game-help">Use arrow keys to move. Score: {score}</p>
      <div className="board">{cells}</div>
      {isGameOver ? (
        <div className="game-over">
          <p>Game Over</p>
          <button type="button" onClick={reset}>
            Restart
          </button>
        </div>
      ) : null}
    </section>
  );
}

function App() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [cartCount, setCartCount] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "signup" ? "signup" : "login";
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setActiveTab("shop");
  };

  if (token) {
    const renderTab = () => {
      if (activeTab === "shop") {
        return (
          <section className="tab-content">
            <div className="shop-grid">
              {PRODUCTS.map((product) => {
                const outOfStock = product.stock === 0;
                return (
                  <article
                    key={product.id}
                    className="product-card"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className={`product-image-wrap${outOfStock ? " faded" : ""}`}>
                      <img src={product.image} alt={product.name} className="product-image" />
                      {outOfStock ? <span className="stock-badge">Out of stock</span> : null}
                    </div>
                    <h3>{product.name}</h3>
                    <p>${product.price.toFixed(2)}</p>
                    {!outOfStock ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setCartCount((prev) => prev + 1);
                        }}
                      >
                        Add to cart
                      </button>
                    ) : null}
                  </article>
                );
              })}
            </div>

            {selectedProduct ? (
              <section className="product-details">
                <h3>{selectedProduct.name}</h3>
                <p>
                  <strong>Details:</strong> {selectedProduct.details}
                </p>
                <p>
                  <strong>How to use:</strong> {selectedProduct.howToUse}
                </p>
                <p>
                  <strong>In stock:</strong> {selectedProduct.stock}
                </p>
              </section>
            ) : null}
          </section>
        );
      }

      if (activeTab === "game") return <SnakeGame />;

      return (
        <section className="tab-content">
          <h2>Contact Us</h2>
          <form
            className="contact-form"
            onSubmit={(event) => {
              event.preventDefault();
              setContactSubmitted(true);
              setContactForm({ name: "", email: "", message: "" });
            }}
          >
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              value={contactForm.name}
              onChange={(event) =>
                setContactForm((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              value={contactForm.email}
              onChange={(event) =>
                setContactForm((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={5}
              value={contactForm.message}
              onChange={(event) =>
                setContactForm((prev) => ({ ...prev, message: event.target.value }))
              }
              required
            />
            <button type="submit">Submit</button>
          </form>
          {contactSubmitted ? <p className="success">Message submitted (demo only).</p> : null}
        </section>
      );
    };

    return (
      <main className="page app-shell">
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
        <h1>My Website</h1>
        <p className="cart-line">Cart items: {cartCount}</p>
        <nav className="tabs">
          <button
            type="button"
            className={activeTab === "shop" ? "active" : ""}
            onClick={() => setActiveTab("shop")}
          >
            Shop
          </button>
          <button
            type="button"
            className={activeTab === "game" ? "active" : ""}
            onClick={() => setActiveTab("game")}
          >
            Game
          </button>
          <button
            type="button"
            className={activeTab === "contact" ? "active" : ""}
            onClick={() => setActiveTab("contact")}
          >
            Contact Us
          </button>
        </nav>
        {renderTab()}
      </main>
    );
  }

  return (
    <main className="page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>{mode === "signup" ? "Create account" : "Sign in"}</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />

        {error ? <p className="error">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
        </button>

        <p className="switch-mode">
          {mode === "signup"
            ? "Already have an account?"
            : "Do not have credentials yet?"}{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setError("");
              setMode(mode === "signup" ? "login" : "signup");
            }}
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>
      </form>
    </main>
  );
}

export default App;
