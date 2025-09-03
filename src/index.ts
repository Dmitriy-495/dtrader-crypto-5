// src/index.ts

import { terminal } from "terminal-kit";
import WebSocket from "ws";

async function main() {
  terminal.clear();
  terminal.bold.blue("Привет! Добро пожаловать в DTrader Crypto CLI\n\n");

  const ws = new WebSocket("wss://api.gateio.ws/ws/v4/");

  ws.on("open", () => {
    terminal.green("✅ Соединение установлено с Gate.io\n");
    const pingMsg = {
      id: 1,
      method: "server.ping",
      params: [],
    };
    terminal.yellow("➡ Отправка ping...\n");
    ws.send(JSON.stringify(pingMsg));
  });

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.id === 1 && msg.result === "pong") {
        terminal.green("⬅ Получен pong от Gate.io\n");
      } else {
        terminal.cyan("ℹ Получено сообщение:", msg, "\n");
      }
    } catch (err: any) {
      terminal.red("❌ Ошибка при разборе сообщения:", err.message, "\n");
    }
  });

  ws.on("error", (err) => {
    terminal.red("🚨 WebSocket ошибка:", err.message, "\n");
  });

  ws.on("close", (code, reason) => {
    terminal.red(
      `🔒 Соединение закрыто (code=${code}, reason=${reason.toString()})\n`
    );
    process.exit(0);
  });
}

main().catch((err) => {
  terminal.red("Не удалось запустить приложение:", err.message, "\n");
  process.exit(1);
});
