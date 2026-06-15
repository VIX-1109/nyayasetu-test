'use client';

import { useEffect, useState, useCallback } from 'react';
import { Fraunces, Tiro_Devanagari_Hindi } from 'next/font/google';

// Self-hosted via next/font (no layout shift, no external request at runtime).
const fraunces = Fraunces({ subsets: ['latin'], weight: ['500'], display: 'swap' });
const tiro = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', display: 'swap' });

/**
 * AnimatedLogo — NyayaSetu scales-of-justice mark + typewriter wordmark.
 *
 * Mark: pure inline-SVG + CSS keyframes. Tips and settles on mount, lifts and
 * replays on hover. No dependencies, crisp at any size.
 *
 * Wordmark: "Setu" is fixed; the "Nyaya" portion types/deletes between English
 * (Nyaya) and Hindi (न्याय), joined as one word "NyayaSetu".
 *
 * Props:
 *   size       number  – icon height in px (default 36)
 *   withText   bool    – render the wordmark (default true)
 *   navy       string  – primary color (default #0F172A)
 *   gold       string  – accent color (default #B45309)
 *   className  string  – extra classes on the wrapper
 */
export default function AnimatedLogo({
  size = 36,
  withText = true,
  navy = '#0F172A',
  gold = '#B45309',
  className = '',
}) {
  // Bumping runId remounts the animated group → restarts the scales animation
  // cleanly on first paint and on every hover.
  const [runId, setRunId] = useState(0);
  const replay = useCallback(() => setRunId((n) => n + 1), []);

  // Typewriter state for the "Nyaya" portion.
  const [typed, setTyped] = useState('Nyaya');
  const [isHindi, setIsHindi] = useState(false);

  useEffect(() => {
    replay();
  }, [replay]);

  useEffect(() => {
    if (!withText) return undefined;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setTyped('Nyaya');
      setIsHindi(false);
      return undefined;
    }

    let cancelled = false;
    const words = [
      { t: 'Nyaya', lang: 'en' },
      { t: 'न्याय', lang: 'hi' },
    ];
    const graphemes = (str, lang) => {
      try {
        const seg = new Intl.Segmenter(lang, { granularity: 'grapheme' });
        return Array.from(seg.segment(str), (s) => s.segment);
      } catch (e) {
        return Array.from(str);
      }
    };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    let wi = 0; // currently showing words[0] = "Nyaya" (from initial state)
    (async () => {
      while (!cancelled) {
        await sleep(2400);
        if (cancelled) return;
        // delete current word
        const cur = graphemes(words[wi].t, words[wi].lang);
        for (let j = cur.length - 1; j >= 0; j -= 1) {
          if (cancelled) return;
          setTyped(cur.slice(0, j).join(''));
          await sleep(95);
        }
        await sleep(250);
        if (cancelled) return;
        // switch language + type next word
        wi = (wi + 1) % words.length;
        setIsHindi(words[wi].lang === 'hi');
        const nx = graphemes(words[wi].t, words[wi].lang);
        for (let k = 1; k <= nx.length; k += 1) {
          if (cancelled) return;
          setTyped(nx.slice(0, k).join(''));
          await sleep(150);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [withText]);

  return (
    <span
      className={`ns-logo inline-flex items-center gap-2 ${className}`}
      onMouseEnter={replay}
    >
      <svg
        className="ns-logo-svg"
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="NyayaSetu"
      >
        {/* ── Static frame: pedestal + column ── */}
        <g stroke={navy} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 13 V46" />
          <path d="M27 52 L29 47 H35 L37 52 Z" fill={navy} />
          <path d="M22 52 H42" strokeWidth="3" />
        </g>
        {/* finial */}
        <circle cx="32" cy="10.4" r="2.6" fill={gold} />

        {/* ── Balancing assembly: remounting on runId replays the animation ── */}
        <g className="ns-beam" key={runId}>
          <path d="M12 16 H52" stroke={navy} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="16" r="1.9" fill={gold} />

          <g className="ns-pan ns-pan-left">
            <circle cx="12" cy="16" r="1.2" fill={navy} />
            <path d="M12 16 L6 28 M12 16 L18 28" stroke={navy} strokeWidth="1.25" strokeLinecap="round" />
            <path d="M5 28 Q12 33.5 19 28 Z" fill={gold} />
          </g>

          <g className="ns-pan ns-pan-right">
            <circle cx="52" cy="16" r="1.2" fill={navy} />
            <path d="M52 16 L46 28 M52 16 L58 28" stroke={navy} strokeWidth="1.25" strokeLinecap="round" />
            <path d="M45 28 Q52 33.5 59 28 Z" fill={gold} />
          </g>
        </g>
      </svg>

      {withText && (
        <span
          className="ns-logo-text"
          aria-hidden="true"
          style={{ color: navy, fontSize: size * 0.64, letterSpacing: '-0.01em' }}
        >
          <span className={isHindi ? tiro.className : fraunces.className}>{typed}</span>
          <span className="ns-cursor" style={{ background: gold }} />
          <span className={fraunces.className}>Setu</span>
        </span>
      )}

      <style jsx>{`
        .ns-logo {
          transition: transform 0.25s ease;
          transform-origin: left center;
          will-change: transform;
        }
        .ns-logo:hover {
          transform: scale(1.06);
        }

        .ns-logo-text {
          display: inline-flex;
          align-items: baseline;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
        }
        .ns-cursor {
          display: inline-block;
          width: 2px;
          height: 0.78em;
          margin: 0 1px;
          transform: translateY(0.12em);
          animation: ns-blink 1s step-end infinite;
        }

        .ns-beam {
          transform-box: view-box;
          transform-origin: 32px 16px;
          animation: ns-settle 2.1s cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }
        .ns-pan {
          transform-box: view-box;
        }
        .ns-pan-left {
          transform-origin: 12px 16px;
          animation: ns-swing 2.1s cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }
        .ns-pan-right {
          transform-origin: 52px 16px;
          animation: ns-swing 2.1s cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }

        @keyframes ns-settle {
          0%   { transform: rotate(0deg); }
          18%  { transform: rotate(-10deg); }
          42%  { transform: rotate(7deg); }
          63%  { transform: rotate(-3.5deg); }
          82%  { transform: rotate(1.5deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes ns-swing {
          0%   { transform: rotate(0deg); }
          18%  { transform: rotate(8deg); }
          42%  { transform: rotate(-5deg); }
          63%  { transform: rotate(2.5deg); }
          82%  { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes ns-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ns-logo:hover { transform: none; }
          .ns-beam, .ns-pan-left, .ns-pan-right, .ns-cursor {
            animation: none !important;
          }
          .ns-cursor { display: none; }
        }
      `}</style>
    </span>
  );
}
