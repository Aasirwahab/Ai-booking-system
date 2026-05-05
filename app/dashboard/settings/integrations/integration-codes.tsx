"use client";

import { useState } from "react";

interface Props {
  appUrl: string;
  slug: string;
}

export function IntegrationCodes({ appUrl, slug }: Props) {
  const bookingLink = `${appUrl}/book/${slug}`;
  const embedCode = `<iframe src="${appUrl}/embed/booking/${slug}" width="100%" height="750" style="border:0; border-radius:12px;"></iframe>`;
  const chatCode = `<script src="${appUrl}/widgets/chat.js" data-org="${slug}"></script>`;

  return (
    <div className="space-y-8">
      <IntegrationBlock
        title="Option 1: Booking Link"
        description="Share this link or add it as a button on your website."
        code={bookingLink}
      />
      <IntegrationBlock
        title="Option 2: Embed Code"
        description="Paste this into any website — WordPress, Wix, Webflow, Shopify, Squarespace, Framer, or custom."
        code={embedCode}
      />
      <IntegrationBlock
        title="Option 3: AI Chat Widget (coming soon)"
        description="Add an AI-powered chat assistant that can answer questions and book appointments."
        code={chatCode}
        disabled
      />
    </div>
  );
}

function IntegrationBlock({
  title,
  description,
  code,
  disabled,
}: {
  title: string;
  description: string;
  code: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`border rounded-lg p-6 ${disabled ? "opacity-60" : ""}`}>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-muted rounded px-3 py-2 text-xs font-mono break-all">
          {code}
        </code>
        <button
          onClick={handleCopy}
          disabled={disabled}
          className="shrink-0 bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
