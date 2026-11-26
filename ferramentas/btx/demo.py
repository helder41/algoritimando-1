# Vídeo de demonstração para a BTX (~30 s, 1920x1080, música do jogo).
# Usa as gravações do teaser (ferramentas/teaser/cenas-h) e a mesma montagem
# (moldura, legendas e transições do ferramentas/teaser/monta.py).
#
# Antes, grave as cenas:
#   cd ferramentas/teaser
#   node grava.js h titulo mapa sanduiche robo rua dica album promo fimanim certificado fim
# Depois:
#   python3 -I ferramentas/btx/demo.py
# Saída: ferramentas/btx/saida/algoritimando-demo-btx.mp4
import os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.argv = [sys.argv[0], 'h']
sys.path.insert(0, os.path.join(AQUI, '..', 'teaser'))
import monta as M  # noqa: E402

M.OUT = os.path.join(AQUI, 'saida')
os.makedirs(M.OUT, exist_ok=True)
M.TOTAL = 33.0
NOME = 'algoritimando-demo-btx.mp4'


def roteiro():
    R = [
        dict(nome='titulo', tipo='cartao', src='titulo', dur=3.0),
        dict(nome='mapa', tipo='jogo', src='mapa', parado=True, recorte=None, dur=3.0,
             legendas=[('Os moradores da cidade precisam da sua ajuda', 0.2, 2.9)]),
        dict(nome='sanduiche', tipo='jogo', src='sanduiche', vel=1.5, dur=5.2,
             legendas=[('Arraste as cartas e monte o passo a passo', 0.2, 2.5),
                       ('A montagem mostra o que a ordem escolhida faz', 2.6, 5.1)]),
        dict(nome='robo', tipo='jogo', src='robo', vel=1.8, dur=3.4,
             legendas=[('O robô faz exatamente o que as cartas mandam', 0.2, 3.3)]),
        dict(nome='rua', tipo='jogo', src='rua', vel=2.0, ini=1.2, dur=3.0,
             legendas=[('Cada chamado tem a sua montagem', 0.2, 2.9)]),
        dict(nome='dica', tipo='jogo', src='dica', vel=1.45, ini=0.6, recorte=None, dur=4.2,
             legendas=[('O Robô-guia explica o erro, sem dar a resposta', 0.2, 4.1)]),
        dict(nome='album', tipo='jogo', src='album', vel=1.25, recorte=None, dur=4.0,
             legendas=[('Cada nível vira uma lição e uma figurinha no álbum', 0.2, 3.9)]),
        dict(nome='fimanim', tipo='jogo', src='fimanim', vel=1.15, recorte=None, dur=3.6,
             legendas=[('No final, o álbum completo e a festa na cidade', 0.2, 3.5)]),
        dict(nome='certificado', tipo='jogo', src='certificado', recorte=None, dur=3.2,
             legendas=[('E o certificado de Agente Sênior', 1.0, 3.1)]),
        dict(nome='fim', tipo='cartao', src='fim', dur=0),
    ]
    soma = sum(s['dur'] for s in R)
    R[-1]['dur'] = round(M.TOTAL + M.XF * (len(R) - 1) - soma, 3)
    for s in R:
        s['legendas_pos'] = 'faixa'
    return R


if __name__ == '__main__':
    M.preparar_imagens()
    R = roteiro()
    M.legendas(R)
    for s in R:
        M.cena(s)
    # o juntar do teaser dá o nome do teaser ao arquivo; renomeia
    M.juntar(R)
    os.replace(os.path.join(M.OUT, 'algoritimando-teaser-horizontal.mp4'), os.path.join(M.OUT, NOME))
    print('demo pronto:', os.path.join(M.OUT, NOME))
