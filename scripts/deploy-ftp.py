#!/usr/bin/env python3
"""dist/ içeriğini FTP(S) ile Plesk httpdocs'a yükler.

Kimlik bilgileri sohbete değil, proje kökündeki .env.deploy dosyasına yazılır (git dışıdır):
  FTP_HOST=178.210.168.80
  FTP_USER=<Plesk sistem/FTP kullanıcısı>
  FTP_PASS=<şifre>
  FTP_DIR=/httpdocs
  FTP_TLS=1          # 1: açık FTPS (önerilen), 0: düz FTP

Kullanım:  npm run deploy:ftp   (önce build alır)
"""
import os, sys, ftplib, ssl
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
EXCLUDE = {'bg-mobile.gif', 'bg-mobile.mp4', 'bg-mobile.webm', 'bg-new.mp4', 'bg.mp4', '.DS_Store'}

def load_env():
    env = {}
    f = ROOT / '.env.deploy'
    if not f.exists():
        sys.exit('.env.deploy yok. Örnek: .env.deploy.example dosyasını kopyalayıp doldurun.')
    for line in f.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line: continue
        k, v = line.split('=', 1); env[k.strip()] = v.strip().strip('"').strip("'")
    for k in ('FTP_HOST', 'FTP_USER', 'FTP_PASS'):
        if not env.get(k): sys.exit(f'.env.deploy içinde {k} eksik')
    env.setdefault('FTP_DIR', '/httpdocs'); env.setdefault('FTP_TLS', '1')
    return env

def connect(env):
    if env['FTP_TLS'] == '1':
        ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
        ftp = ftplib.FTP_TLS(context=ctx); ftp.connect(env['FTP_HOST'], 21, timeout=30)
        ftp.auth(); ftp.login(env['FTP_USER'], env['FTP_PASS']); ftp.prot_p()
    else:
        ftp = ftplib.FTP(); ftp.connect(env['FTP_HOST'], 21, timeout=30); ftp.login(env['FTP_USER'], env['FTP_PASS'])
    ftp.set_pasv(True)
    return ftp

def ensure_dir(ftp, path):
    try: ftp.mkd(path)
    except ftplib.error_perm: pass

def main():
    if not (DIST / 'index.html').exists(): sys.exit('dist/index.html yok; önce npm run build')
    env = load_env(); ftp = connect(env)
    base = env['FTP_DIR'].rstrip('/')
    files = [p for p in DIST.rglob('*') if p.is_file() and p.name not in EXCLUDE]
    # assets/brand önce, index.html en son → ziyaretçi yarım yükleme görmesin
    files.sort(key=lambda p: (p.name == 'index.html', str(p)))
    made = set(); total = 0
    for p in files:
        rel = p.relative_to(DIST).as_posix(); remote = f'{base}/{rel}'
        d = remote.rsplit('/', 1)[0]
        parts = d.strip('/').split('/'); cur = ''
        for part in parts:
            cur += '/' + part
            if cur not in made: ensure_dir(ftp, cur); made.add(cur)
        with p.open('rb') as fh: ftp.storbinary(f'STOR {remote}', fh)
        total += p.stat().st_size; print(f'  ↑ {rel}')
    ftp.quit()
    print(f'deploy:ftp tamam — {len(files)} dosya, {total/1048576:.1f} MB → {env["FTP_HOST"]}{base}')

if __name__ == '__main__':
    main()
