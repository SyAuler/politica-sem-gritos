import sys, os, pymupdf
src, dst = sys.argv[1], sys.argv[2]
for f in sorted(os.listdir(src)):
    if not f.endswith('.pdf'): continue
    d = pymupdf.open(os.path.join(src, f))
    with open(os.path.join(dst, f[:-4] + '.txt'), 'w', encoding='utf8') as o:
        for i, p in enumerate(d):
            o.write(f'\n=====PAGE {i+1}=====\n' + p.get_text())
    print(f, d.page_count)
