"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Sparkles } from "lucide-react";

export default function CrewTestPanel() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/crew/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response from BLOX");
      }

      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Test BLOX Crew</CardTitle>
          <Badge variant="secondary" className="rounded-lg gap-1">
            <Sparkles className="size-3" />
            CrewAI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Textarea
              placeholder="Ask BLOX and the team anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] rounded-xl resize-none"
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Send to BLOX
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {response && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs text-muted-foreground mb-2">BLOX Response:</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
