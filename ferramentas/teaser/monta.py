# Monta o teaser a partir das cenas gravadas (grava.js) e das poses da agente.
# Uso: python3 -I monta.py h    (1920x1080)
#      python3 -I monta.py v    (1080x1920)
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter

ORI = sys.argv[1] if len(sys.argv) > 1 else 'h'
SO = sys.argv[2:]                      # refazer só estas cenas (opcional)
AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, '..', '..'))
CENAS = os.path.join(AQUI, 'cenas-' + ORI)
CENAS_H = os.path.join(AQUI, 'cenas-h')
OUT = os.path.join(AQUI, 'saida-' + ORI)
os.makedirs(OUT, exist_ok=True)
W, H = (1920, 1080) if ORI == 'h' else (1080, 1920)
FPS = 30
XF = 0.4                               # duração das transições
TOTAL = 60.0
# ALTA=1 no ambiente: qualidade alta (quase sem perda), para editar ou projetar
ALTA = os.environ.get('ALTA') == '1'
CRF_CENA, CRF_FINAL, AUDIO = ('8', '10', '320k') if ALTA else ('17', '18', '192k')
# a moldura do jogo: a tela do jogo um pouco menor, com a legenda embaixo
if ORI == 'h':
    GW, GH, GX, GY, RAIO, BORDA = 1600, 900, 160, 22, 26, 6
else:
    GW, GH, GX, GY, RAIO, BORDA = 928, 1650, 76, 34, 26, 6
# recorte das cenas de jogo no horizontal: as cartas e a montagem maiores
RECORTE_JOGO = (200, 72, 1720, 968) if ORI == 'h' else None
# só a folha do certificado
RECORTE_CERT = (180, 10, 1560, 878) if ORI == 'h' else None
# a parte do jogo que entra na tela do tablet (sempre da gravação horizontal)
RECORTE_TABLET = (700, 60, 960, 900)


def ff(*args):
    cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *map(str, args)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(' '.join(cmd))
        print(r.stderr)
        raise SystemExit(1)


# ---------------- imagens fixas: fundo, moldura, máscara ----------------
def preparar_imagens():
    cid = Image.open(f'{REPO}/img/story1.webp').convert('RGB')
    esc = max(W / cid.width, H / cid.height) * 1.08
    cid = cid.resize((int(cid.width * esc), int(cid.height * esc)), Image.LANCZOS)
    cid = cid.crop(((cid.width - W) // 2, (cid.height - H) // 2, (cid.width - W) // 2 + W, (cid.height - H) // 2 + H))
    cid = cid.filter(ImageFilter.GaussianBlur(14))
    veu = Image.new('RGB', (W, H), (40, 24, 66))
    Image.blend(cid, veu, 0.62).save(f'{OUT}/fundo.png')

    m = Image.new('L', (GW, GH), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, GW - 1, GH - 1), RAIO, fill=255)
    m.save(f'{OUT}/mascara.png')

    sombra = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sombra).rounded_rectangle((GX - BORDA, GY - BORDA + 12, GX + GW + BORDA, GY + GH + BORDA + 12), RAIO + BORDA, fill=(10, 6, 20, 150))
    sombra.filter(ImageFilter.GaussianBlur(10)).save(f'{OUT}/sombra.png')

    borda = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(borda).rounded_rectangle((GX - BORDA // 2, GY - BORDA // 2, GX + GW + BORDA // 2, GY + GH + BORDA // 2), RAIO + BORDA // 2, outline=(43, 34, 49, 255), width=BORDA)
    borda.save(f'{OUT}/borda.png')

    # poses 1920x1080 e os cantos da tela verde (medidos na imagem 2752x1536)
    for k in 'abcd':
        im = Image.open(f'{REPO}/docs/teaser/teaser-agente-{k}.webp').convert('RGB')
        im = im.resize((1935, 1080), Image.LANCZOS).crop((7, 0, 1927, 1080))
        im.save(f'{OUT}/pose-{k}.png')


def cantos_tela():
    pts = [(826, 896), (1256, 910), (998, 1268), (1446, 1254)]   # sup-esq, sup-dir, inf-esq, inf-dir
    f = 1080 / 1536
    pts = [(x * f - 7, y * f) for x, y in pts]
    cx = sum(p[0] for p in pts) / 4
    cy = sum(p[1] for p in pts) / 4
    # um pouco para fora: nada de verde nas bordas
    return [(cx + (x - cx) * 1.03, cy + (y - cy) * 1.03) for x, y in pts]


# ---------------- uma fonte de vídeo: clipe gravado ou quadro parado ----------------
def entrada_clipe(nome, pasta=None):
    return ['-f', 'concat', '-safe', '0', '-i', os.path.join(pasta or CENAS, nome, 'lista.txt')]


def ultimo_quadro(nome, pasta=None, primeiro=False):
    d = os.path.join(pasta or CENAS, nome)
    fs = sorted(f for f in os.listdir(d) if f.endswith('.jpg'))
    return os.path.join(d, fs[0] if primeiro else fs[-1])


def filtro_clipe(rot, saida, vel=1.0, ini=0.0, dur=5.0, recorte=None, tam=None):
    f = f'[{rot}]setpts=(PTS-STARTPTS)/{vel},fps={FPS},trim=start={ini},setpts=PTS-STARTPTS'
    if recorte:
        x, y, w, h = recorte
        f += f',crop={w}:{h}:{x}:{y}'
    if tam:
        f += f',scale={tam[0]}:{tam[1]}:flags=lanczos'
    f += f',tpad=stop_mode=clone:stop_duration={dur},trim=duration={dur},setsar=1[{saida}]'
    return f


def filtro_parado(rot, saida, dur, tam, recorte=None, zoom=0.05):
    # quadro parado com aproximação lenta (Ken Burns)
    f = f'[{rot}]'
    if recorte:
        x, y, w, h = recorte
        f += f'crop={w}:{h}:{x}:{y},'
    n = int(dur * FPS)
    f += (f'scale={tam[0] * 2}:{tam[1] * 2}:flags=lanczos,'
          f"zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={tam[0]}x{tam[1]}:fps={FPS},"
          f'trim=duration={dur},setsar=1[{saida}]')
    return f


# ---------------- tipos de cena ----------------
def cena(sc):
    nome, tipo, dur = sc['nome'], sc['tipo'], sc['dur']
    ins, fil = [], []

    def add(*a):
        ins.extend(a)
        return len([x for x in ins if x == '-i']) - 1

    if tipo == 'cartao':
        i = add(*entrada_clipe(sc['src']))
        fil.append(filtro_clipe(f'{i}:v', 'base', sc.get('vel', 1), sc.get('ini', 0), dur, tam=(W, H)))

    elif tipo == 'jogo' and ORI == 'v' and sc.get('destaque'):
        # vertical: só um pedaço da tela (a folha do certificado), grande no meio
        x, y, w, h = sc['destaque']
        fundo = add('-loop', '1', '-t', dur, '-i', f'{OUT}/fundo.png')
        j = add('-loop', '1', '-t', dur + 1, '-i', ultimo_quadro(sc['src']))
        larg = 1000
        alt = int(larg * h / w) // 2 * 2
        y0 = (H - alt) // 2 - 90
        fil.append(f'[{j}:v]crop={w}:{h}:{x}:{y},scale={larg}:{alt}:flags=lanczos,fps={FPS},trim=duration={dur},setsar=1[dq]')
        fil.append(f'[{fundo}:v]drawbox=x={(W - larg) // 2 - 6}:y={y0 - 6}:w={larg + 12}:h={alt + 12}:color=0x2b2231:t=fill[fb]')
        fil.append(f'[fb][dq]overlay={(W - larg) // 2}:{y0},format=yuv420p[base]')

    elif tipo == 'jogo':
        fundo = add('-loop', '1', '-t', dur, '-i', f'{OUT}/fundo.png')
        sombra = add('-loop', '1', '-t', dur, '-i', f'{OUT}/sombra.png')
        masc = add('-loop', '1', '-t', dur, '-i', f'{OUT}/mascara.png')
        borda = add('-loop', '1', '-t', dur, '-i', f'{OUT}/borda.png')
        rec = sc.get('recorte', RECORTE_JOGO)
        if sc.get('parado'):
            j = add('-loop', '1', '-t', dur + 1, '-i', ultimo_quadro(sc['src']))
            fil.append(filtro_parado(f'{j}:v', 'jg', dur, (GW, GH), rec))
        else:
            j = add(*entrada_clipe(sc['src']))
            fil.append(filtro_clipe(f'{j}:v', 'jg', sc.get('vel', 1), sc.get('ini', 0), dur, rec, (GW, GH)))
        fil.append(f'[jg]format=rgba[jga];[{masc}:v]format=gray,scale={GW}:{GH}[m];[jga][m]alphamerge[jr]')
        fil.append(f'[{fundo}:v][{sombra}:v]overlay=0:0[f1];[f1][jr]overlay={GX}:{GY}[f2];[f2][{borda}:v]overlay=0:0,format=yuv420p[base]')

    elif tipo == 'pose':
        # a agente com o tablet: o jogo entra na tela verde, em perspectiva
        (x0, y0), (x1, y1), (x2, y2), (x3, y3) = cantos_tela()
        if sc.get('parado'):
            c = add('-loop', '1', '-t', dur + 1, '-i', ultimo_quadro(sc['src'], CENAS_H, sc.get('primeiro', False)))
            fil.append(f'[{c}:v]crop={RECORTE_TABLET[2]}:{RECORTE_TABLET[3]}:{RECORTE_TABLET[0]}:{RECORTE_TABLET[1]},fps={FPS},trim=duration={dur},setpts=PTS-STARTPTS,scale=1920:1080,setsar=1[tl]')
        else:
            c = add(*entrada_clipe(sc['src'], CENAS_H))
            fil.append(filtro_clipe(f'{c}:v', 'tl', sc.get('vel', 1), sc.get('ini', 0), dur, RECORTE_TABLET, (1920, 1080)))
        fil.append(f'[tl]perspective=x0={x0:.1f}:y0={y0:.1f}:x1={x1:.1f}:y1={y1:.1f}:x2={x2:.1f}:y2={y2:.1f}:x3={x3:.1f}:y3={y3:.1f}:sense=destination[tw]')
        atual = 'tw'
        for k, (pose, de, ate) in enumerate(sc['poses']):
            p = add('-loop', '1', '-t', dur, '-i', f'{OUT}/pose-{pose}.png')
            fil.append(f'[{p}:v]format=rgba,colorkey=0x02FE04:0.32:0.12[pk{k}]')
            fil.append(f"[{atual}][pk{k}]overlay=0:0:enable='between(t,{de},{ate})'[po{k}]")
            atual = f'po{k}'
        if ORI == 'h':
            fil.append(f'[{atual}]format=yuv420p[base]')
        else:
            # vertical: um quadrado com a agente, o tablet e o robô, no meio,
            # com borda e sombra como a moldura do jogo
            fundo = add('-loop', '1', '-t', dur, '-i', f'{OUT}/fundo.png')
            lado, y = 1000, (H - 1000) // 2 - 130
            fil.append(f'[{atual}]crop=1080:1080:520:0,scale={lado}:{lado},setsar=1[pr]')
            fil.append(f'[{fundo}:v]drawbox=x={(W - lado) // 2 - 6}:y={y - 6}:w={lado + 12}:h={lado + 12}:color=0x2b2231:t=fill[fb]')
            fil.append(f'[fb][pr]overlay={(W - lado) // 2}:{y},format=yuv420p[base]')
    else:
        raise ValueError(tipo)

    # legendas
    atual = 'base'
    for k, (texto, de, ate) in enumerate(sc.get('legendas', [])):
        png = f'{OUT}/leg-{nome}-{k}.png'
        li = add('-loop', '1', '-t', dur, '-i', png)
        fil.append(f'[{li}:v]format=rgba,fade=t=in:st={de}:d=0.3:alpha=1,fade=t=out:st={ate - 0.3}:d=0.3:alpha=1[lg{k}]')
        fil.append(f'[{atual}][lg{k}]overlay=0:0[lo{k}]')
        atual = f'lo{k}'
    fil.append(f'[{atual}]format=yuv420p[out]')

    ff(*ins, '-filter_complex', ';'.join(fil), '-map', '[out]', '-t', dur, '-r', FPS,
       '-c:v', 'libx264', '-preset', 'medium', '-crf', CRF_CENA, '-pix_fmt', 'yuv420p', f'{OUT}/cena-{nome}.mp4')
    print('cena pronta:', nome, dur)


# ---------------- o roteiro ----------------
def roteiro():
    pos_jogo = 'faixa'
    pos_pose = 'baixo' if ORI == 'v' else ''
    R = [
        dict(nome='intro', tipo='cartao', src='intro', dur=4.8),
        dict(nome='titulo', tipo='cartao', src='titulo', dur=3.6),
        dict(nome='mapa', tipo='jogo', src='mapa', parado=True, recorte=None, dur=3.8,
             legendas=[('Os moradores da cidade precisam da sua ajuda', 0.3, 3.6)]),
        dict(nome='tablet', tipo='pose', src='mochila', poses=[('a', 0, 1.3), ('b', 1.3, 99)], dur=5.2,
             legendas=[('Cada chamado é uma tarefa do dia a dia', 0.3, 5.0)]),
        dict(nome='sanduiche', tipo='jogo', src='sanduiche', vel=1.17 if ORI == 'h' else 1.6, dur=7.0,
             legendas=[('Arraste as cartas e monte o passo a passo', 0.2, 3.4),
                       ('A montagem mostra o que acontece com a ordem escolhida', 3.6, 6.8)]),
        dict(nome='robo', tipo='jogo', src='robo', vel=1.6 if ORI == 'h' else 2.0, ini=0 if ORI == 'h' else 0.9, dur=4.4,
             legendas=[('O robô faz exatamente o que as cartas mandam', 0.2, 4.2)]),
        dict(nome='limonada', tipo='jogo', src='limonada', vel=1.5 if ORI == 'h' else 2.0, ini=0 if ORI == 'h' else 0.4, dur=3.8,
             legendas=[('Cada chamado tem uma montagem diferente', 0.2, 3.6)]),
        dict(nome='pensa', tipo='pose', src='dica', parado=True, primeiro=True, poses=[('c', 0, 99)], dur=2.0,
             legendas=[('Algo fora de ordem?', 0.2, 1.9)]),
        dict(nome='dica', tipo='jogo', src='dica', vel=1.2 if ORI == 'h' else 1.45, recorte=None, dur=5.8,
             legendas=[('O Robô-guia explica o porquê, sem dar a resposta', 0.2, 5.6)]),
        dict(nome='album', tipo='jogo', src='album', vel=1.1, recorte=None, dur=4.5,
             legendas=[('Cada nível concluído vira uma figurinha no álbum', 0.2, 4.3)]),
        dict(nome='ideias', tipo='jogo', src='ideias', parado=True, recorte=None, dur=3.0,
             legendas=[('Cada chamado ensina uma ideia', 0.2, 2.8)]),
        dict(nome='comemora', tipo='pose', src='sanduiche', parado=True, poses=[('d', 0, 99)], dur=1.8,
             legendas=[('De estagiário a Agente Sênior', 0.2, 1.7)]),
        dict(nome='promo', tipo='jogo', src='promo', recorte=None, ini=0.06, dur=2.6,
             legendas=[('De estagiário a Agente Sênior', 0.0, 2.5)]),
        dict(nome='certificado', tipo='jogo', src='certificado', recorte=None, dur=3.2,
             legendas=[('E um certificado no final', 1.6, 3.1)]),
        dict(nome='fim', tipo='cartao', src='fim', dur=5.3),
        dict(nome='creditos', tipo='cartao', src='creditos', ini=0.15, dur=0),
    ]
    soma = sum(s['dur'] for s in R)
    R[-1]['dur'] = round(TOTAL + XF * (len(R) - 1) - soma, 3)
    for s in R:
        pos = pos_pose if s['tipo'] == 'pose' else pos_jogo
        s['legendas_pos'] = pos
    return R


def legendas(R):
    itens = []
    for s in R:
        for k, (t, _, _) in enumerate(s.get('legendas', [])):
            itens.append(dict(arq=f'{OUT}/leg-{s["nome"]}-{k}.png', t=t, pos=s['legendas_pos']))
    with open(f'{OUT}/legendas.json', 'w') as f:
        json.dump(itens, f, ensure_ascii=False)
    subprocess.run(['node', os.path.join(AQUI, 'legendas.js'), ORI, f'{OUT}/legendas.json'], check=True)


# ---------------- efeitos sonoros ----------------
# Os volumes seguem os do jogo (js/som.js): volume de cada efeito x 0,8
# (o padrão dos efeitos), comparado com a música (0,35² = 0,12 no jogo).
# No vídeo a música toca a VOL_MUSICA; os efeitos, na mesma proporção.
VOL_MUSICA = 0.5
MUSICA_NO_JOGO = 0.35 ** 2
ARQUIVOS = {
    'vitoria': ('vitoria.mp3', 0.30), 'promocao': ('promocao.mp3', 0.30), 'festa': ('festafinal.mp3', 0.30),
    'selo': ('selo.mp3', 0.30), 'figurinha': ('figurinha.mp3', 0.28), 'dica': ('dica.mp3', 0.28),
    'quadro': ('quadro.mp3', 0.22), 'cartaVolta': ('carta-volta.mp3', 0.22), 'cartaVai': ('carta-vai.mp3', 0.22),
    'certificado': ('certificado.mp3', 0.32), 'selecaoAgente': ('selecao-agente.mp3', 0.2),
}
# os sintetizados do som.js: notas [frequência, duração] e volume
SINTETIZADOS = {
    'acerto': ([[523, 0.10], [659, 0.16]], 0.10),
    'erro': ([[233, 0.14], [196, 0.20]], 0.07),
}
# o clique da troca de tela fica de fora do vídeo
FORA = {'clique'}


def sintetizar(nome):
    import numpy as np, wave
    notas, vol = SINTETIZADOS[nome]
    sr = 44100
    fim = sum(d * 0.85 for _, d in notas) + notas[-1][1]
    out = np.zeros(int(sr * fim) + 10)
    t0 = 0.0
    for f, d in notas:
        x = np.arange(int(sr * d)) / sr
        nota = np.sin(2 * np.pi * f * x) * np.exp(np.log(0.0001) * x / d)
        i = int(t0 * sr)
        out[i:i + len(nota)] += nota
        t0 += d * 0.85
    arq = f'{OUT}/sint-{nome}.wav'
    with wave.open(arq, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())
    return arq, vol * 0.8


def efeitos_do_video(R):
    eventos, inicio = [], 0.0
    for k, s in enumerate(R):
        if k:
            inicio -= XF
        pasta = CENAS_H if s['tipo'] == 'pose' else CENAS
        arq_sons = os.path.join(pasta, s['src'], 'sons.json')
        if not s.get('parado') and s['tipo'] != 'cartao' and os.path.exists(arq_sons):
            for ev in json.load(open(arq_sons)):
                if ev['n'] in FORA:
                    continue
                ts = ev['t'] / s.get('vel', 1) - s.get('ini', 0)
                # um som que cai um pouquinho antes do corte entra no começo
                if -0.3 <= ts < 0:
                    ts = 0.0
                if not 0 <= ts < s['dur'] - 0.15:
                    continue
                if ev['n'] in ARQUIVOS:
                    a, v = ARQUIVOS[ev['n']]
                    arq, amp = f'{REPO}/audio/efeitos/{a}', v * 0.8
                elif ev['n'] in SINTETIZADOS:
                    arq, amp = sintetizar(ev['n'])
                else:
                    continue
                eventos.append((round(inicio + ts, 3), arq, min(1.5, amp / MUSICA_NO_JOGO * VOL_MUSICA)))
        inicio += s['dur']
    for e in eventos:
        print(f'  {e[0]:6.2f}s  {os.path.basename(e[1])}')
    return eventos


def juntar(R):
    ins, fil = [], []
    for s in R:
        ins += ['-i', f'{OUT}/cena-{s["nome"]}.mp4']
    atual, t = '0:v', R[0]['dur']
    for k in range(1, len(R)):
        off = t - XF
        fil.append(f'[{atual}][{k}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{k}]')
        atual = f'x{k}'
        t = off + R[k]['dur']
    ai = len(R)
    ins += ['-i', f'{REPO}/audio/musica-tema.mp3']
    fil.append(f'[{ai}:a]atrim=duration={TOTAL},afade=t=in:d=0.6,afade=t=out:st={TOTAL - 3}:d=3,volume={VOL_MUSICA}[mus]')
    # os efeitos, cada um no instante em que o jogo o tocou
    eventos = efeitos_do_video(R)
    rotulos = ['[mus]']
    for k, (inicio, arq, ganho) in enumerate(eventos):
        ins += ['-i', arq]
        ms = int(inicio * 1000)
        fil.append(f'[{ai + 1 + k}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume={ganho:.3f},adelay={ms}:all=1[e{k}]')
        rotulos.append(f'[e{k}]')
    fil.append(f"{''.join(rotulos)}amix=inputs={len(rotulos)}:duration=first:normalize=0,alimiter=limit=0.89[a]")
    print('efeitos no vídeo:', len(eventos))
    nome = 'algoritimando-teaser-horizontal.mp4' if ORI == 'h' else 'algoritimando-teaser-vertical.mp4'
    ff(*ins, '-filter_complex', ';'.join(fil), '-map', f'[{atual}]', '-map', '[a]', '-t', TOTAL,
       '-c:v', 'libx264', '-preset', 'slow', '-crf', CRF_FINAL, '-pix_fmt', 'yuv420p', '-r', FPS,
       '-c:a', 'aac', '-b:a', AUDIO, '-movflags', '+faststart', f'{OUT}/{nome}')
    print('vídeo pronto:', nome, 'duração', round(t, 2))


if __name__ == '__main__':
    preparar_imagens()
    R = roteiro()
    legendas(R)
    for s in R:
        if not SO or s['nome'] in SO:
            cena(s)
    juntar(R)
