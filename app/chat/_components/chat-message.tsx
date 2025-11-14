import { Bot } from "lucide-react";

interface AssistantMessageProps {
  content: string;
}

export const AssistantMessage = ({ content }: AssistantMessageProps) => {
  return (
    <div className="flex w-full gap-2 pt-6 pr-14 pb-0 pl-3">
      <div className="border-border bg-primary/10 flex size-8 shrink-0 items-center justify-center rounded-full border">
        <Bot className="text-primary size-3.5"/>
      </div>
      <p className="text-foreground flex-1 text-sm leading-[1.4] whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};

interface UserMessageProps {
  content: string;
}

export const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="flex w-full justify-end pt-6 pr-5 pb-0 pl-10">
      <div className="bg-secondary flex h-10 items-center rounded-full px-4 py-3">
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
      <div className="border-border flex w-full flex-col gap-2.5 rounded-xl border p-3">
        <div className="flex w-full items-center justify-center">
          <p className="text-muted-foreground text-center text-sm leading-[1.4] whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
