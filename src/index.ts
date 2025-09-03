// src/index.ts

import terminalKit from "terminal-kit";
import axios from "axios";

const { terminal, Document, FullscreenBlock, Text, Button } = terminalKit;

// URL для ping-pong. Можно переопределить через PING_URL в окружении
const PING_URL = process.env.PING_URL || "https://api.yourserver.com/ping";

/**
 * Пингуем сервер, замеряем латентность и логируем результат.
 * В случае ошибки — выбрасываемся.
 */
async function pingServer(): Promise<void> {
  const start = Date.now();
  try {
    const response = await axios.get(PING_URL);
    const latency = Date.now() - start;
    console.log(
      `🥊 Pong от сервера: ${response.data} (латентность: ${latency} ms)`
    );
  } catch (error) {
    console.error("🔴 Ошибка при ping-pong:", error);
    process.exit(1);
  }
}

/**
 * Основная точка входа.
 * Сначала логируем приветствие и делаем ping-pong,
 * потом сразу рендерим интерфейс через Document-модель.
 */
async function main() {
  console.log("👋 Добро пожаловать в DTrader Crypto CLI!");
  await pingServer();

  terminal.clear();

  // Создаём корневой документ
  const doc = new Document();

  // Полноэкранный контейнер
  const screen = new FullscreenBlock({
    parent: doc,
    width: "100%",
    height: "100%",
  });

  // Заголовок
  new Text({
    parent: screen,
    content: "DTrader Crypto CLI",
    x: "center",
    y: 2,
    attr: { color: "green", bold: true },
  });

  // Кнопка старта торговли
  const startButton = new Button({
    parent: screen,
    content: "[ Начать торговлю ]",
    x: "center",
    y: 6,
    attr: { fgColor: "white", bgColor: "blue" },
  });

  startButton.on("submit", () => {
    terminal.clear();
    terminal.green("🚀 Торговля запущена...\n");
    process.exit(0);
  });

  // Глобальные клавиши выхода
  doc.on("key", (name) => {
    if (name === "CTRL_C" || name === "q" || name === "ESCAPE") {
      terminal.clear();
      process.exit(0);
    }
  });

  doc.render();
}

main();
