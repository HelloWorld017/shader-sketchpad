import Renderer from "./Renderer";

const renderer = new Renderer(document.querySelector('canvas'));
renderer.render();

window.renderer = renderer;
