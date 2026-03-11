"use client";

import React from "react";

/**
 * Renders text with formatting (combine by nesting):
 * - *text* → bold
 * - _text_ → italic
 * - #text# → highlighted (text-secondary-main)
 * - *_text_* or _*text*_ → bold + italic
 * - *#text#* → bold + highlighted
 * - _#text#_ → italic + highlighted
 * - *_#text#_* or _*#text#*_ or #*_text_*# → bold + italic + highlighted
 */
export function FormattedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  // Order: most specific (all 3) first, then 2-way combos, then single
  const regex =
    /\*_#([^#]+)#_\*|_\*#([^#]+)#\*_|#\*_([^_]+)_\*#|\*#([^#]+)#\*|_#([^#]+)#_|\*_([^_]+)_\*|_\*([^*]+)\*_|#([^#]+)#|\*([^*]+)\*|_([^_]+)_/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    parts.push(
      <React.Fragment key={key++}>
        {text.slice(lastIndex, match.index)}
      </React.Fragment>
    );
    const allThree = "font-extrabold italic text-secondary-main";
    if (match[1] !== undefined) {
      parts.push(
        <span key={key++} className={allThree}>
          {match[1]}
        </span>
      );
    } else if (match[2] !== undefined) {
      parts.push(
        <span key={key++} className={allThree}>
          {match[2]}
        </span>
      );
    } else if (match[3] !== undefined) {
      parts.push(
        <span key={key++} className={allThree}>
          {match[3]}
        </span>
      );
    } else if (match[4] !== undefined) {
      parts.push(
        <span key={key++} className="font-extrabold text-secondary-main">
          {match[4]}
        </span>
      );
    } else if (match[5] !== undefined) {
      parts.push(
        <span key={key++} className="italic text-secondary-main">
          {match[5]}
        </span>
      );
    } else if (match[6] !== undefined) {
      parts.push(
        <span key={key++} className="font-extrabold italic">
          {match[6]}
        </span>
      );
    } else if (match[7] !== undefined) {
      parts.push(
        <span key={key++} className="font-extrabold italic">
          {match[7]}
        </span>
      );
    } else if (match[8] !== undefined) {
      parts.push(
        <span key={key++} className="text-secondary-main">
          {match[8]}
        </span>
      );
    } else if (match[9] !== undefined) {
      parts.push(
        <span key={key++} className="font-extrabold">
          {match[9]}
        </span>
      );
    } else if (match[10] !== undefined) {
      parts.push(
        <span key={key++} className="italic">
          {match[10]}
        </span>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  parts.push(
    <React.Fragment key={key++}>{text.slice(lastIndex)}</React.Fragment>
  );

  return <span className={className}>{parts}</span>;
}
