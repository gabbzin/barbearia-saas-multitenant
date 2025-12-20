import { Bot } from "lucide-react";
import { Streamdown } from "streamdown";

interface AssistantMessageProps {
  content: string;
}

export const AssistantMessage = ({ content }: AssistantMessageProps) => {
  return (
    <div className="flex w-full gap-2 pt-6 pr-14 pb-0 pl-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-primary/10">
        <Bot className="size-3.5 text-primary" />
      </div>
      <div className="flex-1 whitespace-pre-wrap text-foreground text-sm leading-[1.4]">
        <Streamdown>{content}</Streamdown>
      </div>
    </div>
  );
};

interface UserMessageProps {
  content: string;
}

export const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex w-full justify-end pt-6 pr-5 pb-0 pl-10">
      <div className="flex h-10 items-center rounded-full bg-secondary px-4 py-3">
        <p className="text-foreground text-sm leading-[1.4]">{content}</p>
      </div>
    </div>
  );
};

interface SystemMessageProps {
  content: string;
}

export const SystemMessage = ({ content }: SystemMessageProps) => {
  return (
    <div className="flex w-full flex-col gap-3 px-5 pt-6 pb-0">
      <div className="flex w-full flex-col gap-2.5 rounded-xl border border-border p-3">
        <div className="flex w-full items-center justify-center">
          <div className="whitespace-pre-wrap text-center text-muted-foreground text-sm leading-[1.4]">
            <Streamdown>{content}</Streamdown>
          </div>
        </div>
      </div>
    </div>
  );
};
