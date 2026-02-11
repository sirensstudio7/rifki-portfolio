import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import styles from "./Code.module.css";

const FolderIcon = () => (
  <svg className={styles.titleIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

const PROMPT = "rifk@portfolio/code/comingsoon ~ % ";

const typewriter = (
  setText: (v: string) => void,
  target: string,
  speed: number,
  onDone: () => void
) => {
  let index = 0;
  setText("");
  const run = () => {
    if (index >= target.length) {
      onDone();
      return;
    }
    setText(target.slice(0, index + 1));
    index++;
    setTimeout(run, Math.floor(Math.random() * (300 - 100 + 1) + 100));
  };
  run();
};

const Code = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLSpanElement>(null);
  const [prefixText, setPrefixText] = useState(PROMPT);
  const [showTable, setShowTable] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    const onClick = () => inputRef.current?.focus();
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [inputDisabled]);

  const getInputValue = () => inputRef.current?.innerText?.trim() ?? "";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code !== "Enter") return;
    e.preventDefault();
    const value = getInputValue();
    if (inputDisabled) return;

    if (value === "--help" || value === "-h") {
      setShowTable(true);
      if (inputRef.current) inputRef.current.innerText = "";
      return;
    }

    setInputDisabled(true);
    setShowTable(false);
    if (inputRef.current) inputRef.current.innerText = "";

    typewriter(setPrefixText, "Processing, please wait...", 150, () => {
      setTimeout(() => {
        typewriter(setPrefixText, PROMPT, 80, () => {
          setInputDisabled(false);
          setTimeout(() => inputRef.current?.focus(), 0);
        });
      }, 500);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="pt-[120px] w-full max-w-5xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className={styles.screen}>
        <header className={styles.titleBar}>
          <div className={styles.trafficLights}>
            <button
              type="button"
              className={styles.close}
              onClick={() => navigate("/")}
              aria-label="Close"
            />
            <button type="button" className={styles.minimize} aria-label="Minimize" />
            <button type="button" className={styles.maximize} aria-label="Maximize" />
          </div>
          <div className={styles.title}>
            <FolderIcon />
            <span>rifk - zsh - 80x24</span>
          </div>
        </header>
        <div className={styles.content}>
          <code>
            <span className={styles.line}>
              <span className={styles.prefix}>{prefixText}</span>
              <span
                ref={inputRef}
                className={styles.input}
                contentEditable={!inputDisabled}
                suppressContentEditableWarning
                onKeyDown={handleKeyDown}
                role="textbox"
                aria-label="Command input"
              />
              <span className={styles.cursor}>_</span>
            </span>
          </code>
          {showTable && (
            <div className={styles.response}>
              <table>
                <thead>
                  <tr>
                    <th>Command</th>
                    <th>Options</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>--help</td>
                    <td>-h</td>
                    <td>Display all commands</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
};

export default Code;
