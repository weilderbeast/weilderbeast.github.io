import { qsa, qsRequired } from "../utils/utils";
import { closeModal } from "./modal";

let selected = "light";

export const initThemes = () => {
  const btns = qsa<HTMLButtonElement>(".theme-btn");
  const applyBtn = qsRequired<HTMLButtonElement>("#theme-apply-btn");
  const existing = localStorage.getItem("theme");

  if (existing) {
    selected = existing;
    document.body.className = `${selected}`;
  }

  const render = () => {
    btns.forEach((btn) => {
      const title = qsRequired<HTMLSpanElement>(".title", btn);
      const theme = title.dataset.theme ?? "dark";

      if (btn.className.includes(selected)) {
        btn.classList.add("active");
        title.append(" - selected");
      } else {
        btn.classList.remove("active");
        title.textContent = theme;
      }

      btn.onclick = () => {
        selected = theme;
        localStorage.setItem("theme", theme);
        render();
      };
    });
  };

  render();

  applyBtn.onclick = () => {
    document.body.className = `${selected}`;
    closeModal("theme");
  };
};
