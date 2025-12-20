"use client";

import { useChat } from "@ai-sdk/react";
import { ChevronLeft, Mic, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { AssistantMessage, UserMessage } from "./_components/chat-message";

export default function ChatPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || status === "streaming") return;

    sendMessage({ role: "user", parts: [{ type: "text", text: inputValue }] });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between px-5 pt-6 pb-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="size-6 p-0"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <p className="font-['Merriweather'] text-foreground text-xl italic tracking-[-1px]">
          Aparatus
        </p>
        <div className="size-6" />
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <AssistantMessage content="Olá! Sou o Aparatus, seu assistente pessoal.&#10;&#10;Estou aqui para te auxiliar a agendar seu corte ou barba, encontrar as barbearias disponíveis perto de você e responder às suas dúvidas." />

        {messages.map(message => {
          const messageText =
            message.parts
              .filter(part => part.type === "text")
              .map(part => (part.type === "text" ? part.text : ""))
              .join("") || "";

          return message.role === "user" ? (
            <UserMessage key={message.id} content={messageText} />
          ) : (
            <AssistantMessage key={message.id} content={messageText} />
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="fixed right-0 bottom-0 left-0 bg-border p-5">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem"
            className="flex-1 rounded-full bg-background px-4 py-3 text-sm"
            disabled={status === "streaming"}
          />
          <Button
            type="button"
            size="icon"
            className="size-[42px] shrink-0 rounded-full bg-primary p-2.5"
            disabled
          >
            <Mic className="size-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            className="size-[42px] shrink-0 rounded-full bg-primary p-2.5"
            disabled={status === "streaming" || !inputValue.trim()}
          >
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
