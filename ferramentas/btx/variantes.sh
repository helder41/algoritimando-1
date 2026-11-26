#!/usr/bin/env bash
# Gera todas as versões dos vídeos da BTX a partir dos vídeos de qualidade alta
# (ALTA=1 python3 -I ferramentas/teaser/monta.py h|v e ferramentas/btx/demo.py).
#
# Uso: ferramentas/btx/variantes.sh <pasta-de-saida> <abertura-horizontal.mp4> <abertura-vertical.mp4>
# Saída (as mesmas pastas entregues antes):
#   videos/        qualidade máxima, sem abertura
#   documento/     1080p mais leve, para mandar como Documento no WhatsApp
#   whatsapp/      720p, menos de 16 MB, para mandar como vídeo
#   com-abertura/{qualidade-maxima,documento,whatsapp}/  as mesmas, com a abertura no começo
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
SAI="$1"; AB_H="$2"; AB_V="$3"
TEASER="$AQUI/../teaser"
declare -A ORIGEM=(
  [algoritimando-teaser-horizontal]="$TEASER/saida-h/algoritimando-teaser-horizontal.mp4"
  [algoritimando-teaser-vertical]="$TEASER/saida-v/algoritimando-teaser-vertical.mp4"
  [algoritimando-demo-btx]="$AQUI/saida/algoritimando-demo-btx.mp4"
)
FF=(ffmpeg -hide_banner -loglevel error -y)
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
mkdir -p "$SAI"/{videos,documento,whatsapp} "$SAI"/com-abertura/{qualidade-maxima,documento,whatsapp}

# versão leve para Documento: 1080p, CRF 18
documento() { "${FF[@]}" -i "$1" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$2"; }

# versão para WhatsApp: 720p, 2 passes, abaixo de 16 MB
whatsapp() {
  local dur vf kbps
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
  vf=$3
  kbps=$(python3 -c "print(int(15.2*8*1024/$dur - 128))")
  "${FF[@]}" -i "$1" -vf "$vf" -c:v libx264 -preset slow -b:v ${kbps}k -pass 1 -passlogfile "$TMP/p" -an -f mp4 /dev/null
  "${FF[@]}" -i "$1" -vf "$vf" -c:v libx264 -preset slow -b:v ${kbps}k -pass 2 -passlogfile "$TMP/p" -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$2"
}

# abertura + vídeo, re-codificado em qualidade alta (CRF 12)
com_abertura() {
  local ab=$1 vid=$2 out=$3 w h
  w=$(ffprobe -v error -select_streams v -show_entries stream=width -of csv=p=0 "$vid")
  h=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 "$vid")
  "${FF[@]}" -i "$ab" -i "$vid" -filter_complex \
    "[0:v]scale=${w}:${h}:flags=lanczos,fps=30,setsar=1,format=yuv420p[a];[1:v]fps=30,setsar=1,format=yuv420p[b];\
[0:a]aresample=48000,aformat=channel_layouts=stereo[aa];[1:a]aresample=48000,aformat=channel_layouts=stereo[ba];\
[a][aa][b][ba]concat=n=2:v=1:a=1[v][au]" \
    -map "[v]" -map "[au]" -c:v libx264 -preset slow -crf 12 -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart "$out"
}

for nome in "${!ORIGEM[@]}"; do
  src=${ORIGEM[$nome]}
  if [[ $nome == *vertical* ]]; then ab=$AB_V; wvf="scale=720:1280:flags=lanczos"; else ab=$AB_H; wvf="scale=1280:720:flags=lanczos"; fi
  echo "== $nome"
  cp "$src" "$SAI/videos/$nome.mp4"
  documento "$src" "$SAI/documento/$nome-documento.mp4"
  whatsapp "$src" "$SAI/whatsapp/$nome-whatsapp.mp4" "$wvf"
  com_abertura "$ab" "$src" "$SAI/com-abertura/qualidade-maxima/$nome.mp4"
  documento "$SAI/com-abertura/qualidade-maxima/$nome.mp4" "$SAI/com-abertura/documento/$nome-documento.mp4"
  whatsapp "$SAI/com-abertura/qualidade-maxima/$nome.mp4" "$SAI/com-abertura/whatsapp/$nome-whatsapp.mp4" "$wvf"
done
echo "pronto: $SAI"
