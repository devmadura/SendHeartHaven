"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MessageCard } from "@/components/layout";
import { MessageData } from "@/lib/data";

export function LibraryView({ messages }: { messages: MessageData[] }) {
  return (
    <div className="w-full max-w-4xl px-6 py-24 mx-auto relative z-10 flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl text-on-surface font-normal tracking-tight">
          Library
        </h1>
        <p className="font-sans text-sm tracking-widest uppercase text-tertiary">
          Arsip Pesan-Pesan yang Tersimpan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {messages.map((msg, idx) => (
          <Link href={`/library/${msg.id}`} key={msg.id} className={idx === 2 ? "md:col-span-2" : ""}>
            <div className="h-full cursor-pointer hover:shadow-sm transition-shadow">
              <MessageCard
                content={msg.content}
                author={msg.author}
                date={msg.date}
                className="h-full hover:border-tertiary/30 transition-colors"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
