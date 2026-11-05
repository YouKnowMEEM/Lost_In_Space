import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lightbulb, RotateCcw, X } from "lucide-react";
import ObjectArt from "./Glyphs";
import { CATALOG, WORLDS } from "../data/catalog";

const ROUNDS = 8;
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Eight riddles, each spoken by a real machine. Distractors come mostly from the same world, so the clues matter. */
function makeGame() {
  const pool = CATALOG.filter((c) => c.riddle);
  return shuffle(pool)
    .slice(0, ROUNDS)
    .map((answer) => {
      const same = shuffle(pool.filter((c) => c.id !== answer.id && c.world === answer.world)).slice(0, 2);
      const other = shuffle(pool.filter((c) => c.id !== answer.id && c.world !== answer.world));
      const fill = [...same, ...other].slice(0, 3);
      return { answer, options: shuffle([answer, ...fill]) };
    });
}

export default function WhoAmI() {
  const [game, setGame] = useState(makeGame);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [clean, setClean] = useState(0);
  const nextRef = useRef(null);

  const round = game[i];
  const done = i >= game.length;
  const answered = picked !== null;

  const choose = (opt) => {
    if (answered) return;
    setPicked(opt.id);
    if (opt.id === round.answer.id) {
      setScore((s) => s + 1);
      if (!hint) setClean((c) => c + 1);
    }
    setTimeout(() => nextRef.current?.focus(), 30);
  };
  const next = () => {
    setI((n) => n + 1);
    setPicked(null);
    setHint(false);
  };
  const again = () => {
    setGame(makeGame());
    setI(0);
    setPicked(null);
    setHint(false);
    setScore(0);
    setClean(0);
  };

  const verdict = useMemo(() => {
    if (score >= 7) return "Mission control wants to hire you. You know these machines.";
    if (score >= 5) return "Great flying. You have met most of the machines.";
    if (score >= 3) return "A good start. Each story in the Atlas will teach you more.";
    return "Every explorer starts somewhere. Read a few stories and try again.";
  }, [score]);

  if (done) {
    return (
      <div className="wa wa-end" role="status">
        <h3>
          {score} out of {game.length}
        </h3>
        <p>{verdict}</p>
        <p className="wa-sub">{clean} without needing a hint.</p>
        <div className="wa-actions">
          <button type="button" className="hp-btn hp-btn-primary" onClick={again}>
            <RotateCcw size={18} aria-hidden="true" /> Play again with new riddles
          </button>
          <Link to="/atlas" className="hp-btn hp-btn-quiet">
            Read their stories
          </Link>
        </div>
      </div>
    );
  }

  const correct = picked === round.answer.id;
  return (
    <div className="wa">
      <div className="wa-top">
        <span>
          Riddle {i + 1} of {game.length}
        </span>
        <span>
          Score <b>{score}</b>
        </span>
      </div>
      <div className="wa-bar" aria-hidden="true">
        <span style={{ width: `${(i / game.length) * 100}%` }} />
      </div>
      <p className="wa-riddle">
        <span className="wa-quote" aria-hidden="true">“</span>
        {round.answer.riddle}
      </p>
      {hint && !answered && (
        <p className="wa-hint">
          Hint: I am in <b>{WORLDS[round.answer.world].name}</b> and my story starts in <b>{round.answer.year}</b>.
        </p>
      )}
      <p className="wa-ask" id="wa-ask">
        Who am I?
      </p>
      <div className="wa-options" role="group" aria-labelledby="wa-ask">
        {round.options.map((o) => {
          const isAnswer = o.id === round.answer.id;
          const cls = answered ? (isAnswer ? " is-right" : o.id === picked ? " is-wrong" : " is-dim") : "";
          return (
            <button key={o.id} type="button" className={`wa-opt${cls}`} onClick={() => choose(o)} disabled={answered && !isAnswer && o.id !== picked} aria-disabled={answered}>
              <span>{o.short}</span>
              <small>{o.mission !== o.short ? o.mission : WORLDS[o.world].short}</small>
              {answered && isAnswer && <Check size={20} aria-hidden="true" />}
              {answered && !isAnswer && o.id === picked && <X size={20} aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {!answered && (
        <button type="button" className="wa-hintbtn" onClick={() => setHint(true)} disabled={hint}>
          <Lightbulb size={17} aria-hidden="true" /> {hint ? "Hint shown" : "Show a hint"}
        </button>
      )}
      <div className="wa-result" role="status" aria-live="polite">
        {answered && (
          <div className={`wa-reveal ${correct ? "is-right" : "is-wrong"}`}>
            <div className="wa-reveal-art">
              <ObjectArt item={round.answer} alt="" />
            </div>
            <div>
              <p className="wa-reveal-head">{correct ? "That is right!" : `Not quite. I am ${round.answer.short}.`}</p>
              <p>
                <b>{round.answer.short}</b>: {round.answer.tagline}
              </p>
              <Link to={round.answer.route} className="wa-link">
                Read my story <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </div>
      {answered && (
        <button type="button" ref={nextRef} className="hp-btn hp-btn-primary wa-next" onClick={next}>
          {i + 1 === game.length ? "See my score" : "Next riddle"} <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
