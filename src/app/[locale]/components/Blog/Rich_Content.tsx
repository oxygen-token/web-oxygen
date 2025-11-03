"use client";
import { useEffect, useRef } from "react";

interface Rich_Content_Props {
  html: string;
}

export default function Rich_Content({ html }: Rich_Content_Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = html || "";

    const root = ref.current;

    // Enhanced headings with decorative elements
    root.querySelectorAll("h1").forEach((el) => {
      el.classList.add(
        "text-4xl", "md:text-5xl", "lg:text-6xl",
        "font-extrabold", "mt-12", "mb-8",
        "leading-tight", "text-white",
        "tracking-tight",
        "relative", "inline-block"
      );
      el.innerHTML = `<span class="relative z-10">${el.innerHTML}</span>`;
      const gradient = document.createElement("div");
      gradient.className = "absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full opacity-80";
      el.appendChild(gradient);
    });

    root.querySelectorAll("h2").forEach((el) => {
      el.classList.add(
        "text-3xl", "md:text-4xl",
        "font-bold", "mt-16", "mb-6",
        "text-white", "tracking-tight",
        "flex", "items-center", "gap-3"
      );
      const decorator = document.createElement("span");
      decorator.className = "w-1.5 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-full flex-shrink-0";
      el.insertBefore(decorator, el.firstChild);
    });

    root.querySelectorAll("h3").forEach((el) => {
      el.classList.add(
        "text-xl", "md:text-2xl",
        "font-semibold", "mt-10", "mb-4",
        "text-white/95", "tracking-tight"
      );
    });

    // Enhanced paragraphs
    root.querySelectorAll("p").forEach((el) => {
      el.classList.add(
        "text-white/80", "leading-relaxed",
        "text-base", "md:text-lg",
        "mb-5", "font-light"
      );
    });

    // Enhanced links with hover effects
    root.querySelectorAll("a").forEach((el) => {
      el.classList.add(
        "text-teal-300", "hover:text-teal-200",
        "underline", "decoration-teal-400/40",
        "hover:decoration-teal-300",
        "underline-offset-4",
        "transition-all", "duration-300",
        "font-medium",
        "hover:decoration-2"
      );
    });

    // Enhanced lists
    root.querySelectorAll("ul").forEach((el) => {
      el.classList.add("my-6", "space-y-3", "pl-0");
    });

    root.querySelectorAll("ul > li").forEach((el) => {
      el.classList.add(
        "flex", "items-start", "gap-3",
        "text-white/80", "leading-relaxed",
        "text-base", "md:text-lg"
      );
      const bullet = document.createElement("span");
      bullet.className = "mt-2 w-2 h-2 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex-shrink-0";
      (el as HTMLElement).style.listStyle = "none";
      el.insertBefore(bullet, el.firstChild);
    });

    root.querySelectorAll("ol").forEach((el) => {
      el.classList.add("my-6", "space-y-3", "pl-0", "counter-reset-[item]");
    });

    root.querySelectorAll("ol > li").forEach((el, idx) => {
      el.classList.add(
        "flex", "items-start", "gap-3",
        "text-white/80", "leading-relaxed",
        "text-base", "md:text-lg"
      );
      const number = document.createElement("span");
      number.className = "mt-0.5 min-w-6 h-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0";
      number.textContent = String(idx + 1);
      (el as HTMLElement).style.listStyle = "none";
      el.insertBefore(number, el.firstChild);
    });

    // Enhanced blockquotes
    root.querySelectorAll("blockquote").forEach((el) => {
      el.classList.add(
        "my-8", "pl-6", "pr-4", "py-4",
        "border-l-4", "border-teal-400",
        "bg-white/5", "rounded-r-lg",
        "text-white/90", "italic",
        "backdrop-blur-sm"
      );
    });

    // Code blocks
    root.querySelectorAll("pre").forEach((el) => {
      el.classList.add(
        "my-6", "p-4", "rounded-xl",
        "bg-black/40", "border", "border-white/10",
        "overflow-x-auto",
        "backdrop-blur-sm"
      );
    });

    root.querySelectorAll("code").forEach((el) => {
      if (el.parentElement?.tagName !== "PRE") {
        el.classList.add(
          "px-2", "py-0.5", "rounded",
          "bg-white/10", "text-teal-300",
          "text-sm", "font-mono"
  );
}

    });

    // Enhanced tables
    root.querySelectorAll("table").forEach((table) => {
      table.classList.add("w-full", "text-left", "text-white/90", "my-8", "border-collapse");
      
      const wrapper = document.createElement("div");
      wrapper.className = "overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-black/30";
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
      
      table.querySelectorAll("thead").forEach((thead) => {
        thead.classList.add("bg-gradient-to-r", "from-white/10", "to-white/5");
      });
      
      table.querySelectorAll("th").forEach((th) => {
        th.classList.add(
          "px-6", "py-4",
          "font-semibold", "text-white",
          "border-b", "border-white/20",
          "text-sm", "md:text-base",
          "uppercase", "tracking-wider"
        );
      });
      
      table.querySelectorAll("td").forEach((td) => {
        td.classList.add(
          "px-6", "py-4",
          "border-b", "border-white/10",
          "text-sm", "md:text-base"
        );
      });
      
      table.querySelectorAll("tbody tr").forEach((tr) => {
        tr.classList.add("transition-colors", "duration-200", "hover:bg-white/10");
      });
      
      table.querySelectorAll("tbody tr:nth-child(odd)").forEach((tr) => {
        tr.classList.add("bg-white/5");
      });
    });

    // Enhanced FAQ accordion
    const h3s = Array.from(root.querySelectorAll("h3"));
    h3s.forEach((h3) => {
      const text = h3.textContent?.trim() || "";
      if (!text.endsWith("?")) return;
      
      const next = h3.nextElementSibling;
      if (!next || next.tagName !== "P") return;
      
      const details = document.createElement("details");
      details.className = "group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-5 my-5 transition-all duration-300 hover:border-teal-400/30 hover:shadow-lg hover:shadow-teal-400/10";
      
      const summary = document.createElement("summary");
      summary.className = "list-none cursor-pointer text-white font-medium text-lg flex items-center justify-between select-none";
      
      const textSpan = document.createElement("span");
      textSpan.textContent = text;
      textSpan.className = "pr-4";
      
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-500/20 flex items-center justify-center transition-all duration-300 group-open:bg-gradient-to-br group-open:from-teal-400/30 group-open:to-cyan-500/30";
      
      const icon = document.createElement("span");
      icon.className = "text-teal-300 transition-transform duration-300 group-open:rotate-180 text-xl";
      icon.innerHTML = "▾";
      
      iconWrapper.appendChild(icon);
      summary.appendChild(textSpan);
      summary.appendChild(iconWrapper);
      
      const body = document.createElement("div");
      body.className = "mt-4 pt-4 border-t border-white/10 text-white/80 leading-relaxed";
      body.appendChild(next.cloneNode(true));
      
      details.appendChild(summary);
      details.appendChild(body);
      
      next.remove();
      h3.replaceWith(details);
    });

    // Add horizontal rules styling
    root.querySelectorAll("hr").forEach((el) => {
      el.classList.add(
        "my-12", "border-0", "h-px",
        "bg-gradient-to-r", "from-transparent", "via-white/20", "to-transparent"
      );
    });

    // Images
    root.querySelectorAll("img").forEach((el) => {
      el.classList.add(
        "rounded-xl", "my-8",
        "shadow-2xl", "shadow-black/40",
        "border", "border-white/10"
      );
    });

  }, [html]);

  return (
    <article className="prose prose-invert max-w-none">
      <div 
        ref={ref}
        className="text-white/90"
      />
    </article>
  );
}
