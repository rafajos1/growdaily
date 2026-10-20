/**
 * Prints only the element marked `.print-area` (see globals.css). The class it
 * adds only affects printing, so it's harmless if a browser never fires afterprint.
 */
export function printArea(): void {
  const root = document.documentElement;
  root.classList.add("print-doc");
  const done = () => {
    root.classList.remove("print-doc");
    window.removeEventListener("afterprint", done);
  };
  window.addEventListener("afterprint", done);
  window.print();
}
