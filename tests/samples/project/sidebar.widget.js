export function render({ model, el }) {
  el.textContent = "title=" + model.get("title");
}
