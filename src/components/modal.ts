interface ModalInstance {
  element: HTMLElement;
  backdrop: HTMLElement | null;
  closable: boolean;
  useBackdrop: boolean;
  open: () => void;
  close: () => void;
}

const instances = new Map<string, ModalInstance>();
let keydownWired = false;

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;

  instances.forEach((instance, id) => {
    if (instance.closable && instance.element.classList.contains("show")) {
      closeModal(id);
    }
  });
}

function buildModal(container: HTMLElement): void {
  const id = container.id;
  if (!id || instances.has(id)) return;

  const closable = container.dataset.closable !== "false";
  const useBackdrop = container.dataset.backdrop !== "false";

  container.classList.add("modal", "fade");
  container.setAttribute("tabindex", "-1");
  container.setAttribute("role", "dialog");
  container.setAttribute("aria-modal", "true");
  container.setAttribute("aria-hidden", "true");
  container.style.display = "none";

  const instance: ModalInstance = {
    element: container,
    backdrop: null,
    closable,
    useBackdrop,
    open: () => openModal(id),
    close: () => closeModal(id),
  };

  instances.set(id, instance);

  container
    .querySelectorAll<HTMLElement>('[data-dismiss="modal"], .btn-close')
    .forEach((el) => {
      if (el.dataset.modalWired === "true") return;
      el.dataset.modalWired = "true";
      el.addEventListener("click", () => closeModal(id));
    });
}

function wireTriggers(root: ParentNode): void {
  root
    .querySelectorAll<HTMLElement>('[data-toggle="modal"]')
    .forEach((trigger) => {
      if (trigger.dataset.modalWired === "true") return;

      const targetSelector = trigger.dataset.target;
      if (!targetSelector) return;

      const targetId = targetSelector.replace(/^#/, "");

      trigger.dataset.modalWired = "true";
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        openModal(targetId);
      });
    });
}

export function initModals(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>(".modal");
  containers.forEach(buildModal);
  wireTriggers(root);

  if (!keydownWired) {
    keydownWired = true;
    document.addEventListener("keydown", onKeydown);
  }
}

export function openModal(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const { element, useBackdrop } = instance;

  element.classList.add("show");
  element.style.display = "flex";
  element.setAttribute("aria-hidden", "false");

  if (useBackdrop && !instance.backdrop) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade show";
    backdrop.addEventListener("click", () => closeModal(id));
    document.body.append(backdrop);
    instance.backdrop = backdrop;
  }
}

export function closeModal(id: string): void {
  const instance = instances.get(id);
  if (!instance) return;

  const { element } = instance;

  element.classList.remove("show");
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");

  instance.backdrop?.remove();
  instance.backdrop = null;
}

export function getModal(id: string): ModalInstance | undefined {
  return instances.get(id);
}

export default initModals;
