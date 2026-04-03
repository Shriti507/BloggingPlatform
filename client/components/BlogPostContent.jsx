"use client";

/**
 * Renders the full blog body with proper typography.
 * Supports headings (# / ## / ###), paragraphs, bold, italic, inline code,
 * unordered/ordered lists, blockquotes, images, and horizontal rules.
 *
 * Designed for a Notion/Medium-style reading experience.
 */
export default function BlogPostContent({ body }) {
  if (!body) return null;

  const blocks = parseBlocks(body);

  return (
    <div id="blog-post-content" className="blog-prose">
      {blocks.map((block, i) => renderBlock(block, i))}
    </div>
  );
}

/* ─── Block Parser ─── */

function parseBlocks(body) {
  const raw = body.split("\n");
  const blocks = [];
  let i = 0;

  while (i < raw.length) {
    const line = raw[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      blocks.push({
        type: `h${headingMatch[1].length}`,
        content: headingMatch[2],
      });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines = [];
      while (i < raw.length && raw[i].trim().startsWith("> ")) {
        quoteLines.push(raw[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "blockquote", content: quoteLines.join(" ") });
      continue;
    }

    // Image markdown: ![alt](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push({ type: "image", alt: imgMatch[1], src: imgMatch[2] });
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      const items = [];
      while (i < raw.length && /^[-*+]\s+/.test(raw[i].trim())) {
        items.push(raw[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items = [];
      while (i < raw.length && /^\d+[.)]\s+/.test(raw[i].trim())) {
        items.push(raw[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph — collect consecutive non-special lines
    const paraLines = [];
    while (
      i < raw.length &&
      raw[i].trim() &&
      !/^#{1,3}\s+/.test(raw[i].trim()) &&
      !/^[-*_]{3,}$/.test(raw[i].trim()) &&
      !raw[i].trim().startsWith("> ") &&
      !/^!\[/.test(raw[i].trim()) &&
      !/^[-*+]\s+/.test(raw[i].trim()) &&
      !/^\d+[.)]\s+/.test(raw[i].trim())
    ) {
      paraLines.push(raw[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "p", content: paraLines.join(" ") });
    }
  }

  return blocks;
}

/* ─── Inline Formatting ─── */

function renderInline(text) {
  if (!text) return null;

  // Process inline formatting: bold, italic, code, links
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Inline code
    let match = remaining.match(/^(.*?)`([^`]+)`(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <code
          key={key++}
          className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-800"
        >
          {match[2]}
        </code>
      );
      remaining = match[3];
      continue;
    }

    // Bold **text**
    match = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <strong key={key++} className="font-semibold text-neutral-900">
          {match[2]}
        </strong>
      );
      remaining = match[3];
      continue;
    }

    // Italic *text*
    match = remaining.match(/^(.*?)\*(.+?)\*(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <em key={key++} className="italic text-neutral-700">
          {match[2]}
        </em>
      );
      remaining = match[3];
      continue;
    }

    // Link [text](url)
    match = remaining.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)$/s);
    if (match) {
      if (match[1]) parts.push(<span key={key++}>{match[1]}</span>);
      parts.push(
        <a
          key={key++}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 transition hover:text-indigo-800 hover:decoration-indigo-500"
        >
          {match[2]}
        </a>
      );
      remaining = match[4];
      continue;
    }

    // No more inline formatting
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return parts;
}

/* ─── Block Renderer ─── */

function renderBlock(block, key) {
  switch (block.type) {
    case "h1":
      return (
        <h2
          key={key}
          className="mt-10 mb-4 font-serif text-2xl font-bold leading-tight tracking-tight text-neutral-900 first:mt-0 sm:text-3xl"
        >
          {renderInline(block.content)}
        </h2>
      );
    case "h2":
      return (
        <h3
          key={key}
          className="mt-8 mb-3 font-serif text-xl font-bold leading-snug tracking-tight text-neutral-900 first:mt-0 sm:text-2xl"
        >
          {renderInline(block.content)}
        </h3>
      );
    case "h3":
      return (
        <h4
          key={key}
          className="mt-6 mb-2 font-serif text-lg font-semibold leading-snug text-neutral-900 first:mt-0"
        >
          {renderInline(block.content)}
        </h4>
      );
    case "p":
      return (
        <p
          key={key}
          className="mt-5 text-base leading-[1.8] text-neutral-700 first:mt-0 sm:text-[17px]"
        >
          {renderInline(block.content)}
        </p>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="mt-6 border-l-[3px] border-neutral-300 py-1 pl-5 text-base italic leading-relaxed text-neutral-600"
        >
          {renderInline(block.content)}
        </blockquote>
      );
    case "ul":
      return (
        <ul key={key} className="mt-5 space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-base leading-relaxed text-neutral-700">
              <span className="mt-2.5 block h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="mt-5 space-y-2 pl-1">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-2.5 text-base leading-relaxed text-neutral-700">
              <span className="mt-0.5 shrink-0 text-sm font-semibold text-neutral-400">
                {j + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    case "image":
      return (
        <figure key={key} className="mt-8">
          <img
            src={block.src}
            alt={block.alt || ""}
            className="w-full rounded-xl object-cover shadow-sm"
            loading="lazy"
          />
          {block.alt && (
            <figcaption className="mt-2.5 text-center text-xs text-neutral-400">
              {block.alt}
            </figcaption>
          )}
        </figure>
      );
    case "hr":
      return (
        <hr key={key} className="my-10 border-t border-neutral-200" />
      );
    default:
      return null;
  }
}
