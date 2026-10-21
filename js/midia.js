// AULA 4: teste de formatos com canPlayType() e aviso discreto na página
const elementoVideo = document.getElementById("video-demo");
const avisoFormato = document.getElementById("aviso-formato");

if (elementoVideo && avisoFormato) {
  const suporteWebm = elementoVideo.canPlayType('video/webm; codecs="vp9, opus"');
  const suporteMp4 = elementoVideo.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
  console.log(`canPlayType WebM: "${suporteWebm}" | MP4: "${suporteMp4}"`);

  if (suporteWebm !== "") {
    avisoFormato.textContent = "Seu navegador provavelmente usará o formato WebM.";
  } else if (suporteMp4 !== "") {
    avisoFormato.textContent = "Seu navegador provavelmente usará o formato MP4.";
  } else {
    avisoFormato.textContent = "Seu navegador pode não reproduzir este vídeo; use o link de download.";
  }
}
