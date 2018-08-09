import Renderer from "./Renderer";

const renderer = new Renderer(document.querySelector('canvas'));
setInterval(() => renderer.render(), 30);

window.renderer = renderer;
