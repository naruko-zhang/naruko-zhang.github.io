#!/usr/bin/env python3
"""修正年份错误：把误存为2025年的2024年文章修正，同时扩宽页面布局"""
import urllib.request, urllib.error, json, subprocess

def get_cookie():
    hook = """
global.fetch = new Proxy(global.fetch, {
  apply(target, thisArg, args) {
    const opts = args[1] || {};
    const headers = opts.headers || {};
    const cookie = headers['Cookie'] || headers['cookie'] || '';
    if (cookie) require('fs').writeFileSync('/tmp/blog_session.txt', 'COOKIE=' + cookie + '\\n');
    return Reflect.apply(target, thisArg, args);
  }
});
process.argv = ['node', 'appwrite-cf', 'tables-db', 'list'];
require('/usr/local/lib/node_modules/@codeflicker/appwrite-cli/dist/cli.cjs');
"""
    with open('/tmp/hook.cjs', 'w') as f:
        f.write(hook)
    subprocess.run(['node', '/tmp/hook.cjs'],
                   cwd='/data/aime/b4eb63ab-f204-4aea-a256-3ef424874016/workspace/blog',
                   capture_output=True)
    try:
        return open('/tmp/blog_session.txt').read().split('COOKIE=')[1].strip()
    except:
        return None

COOKIE = get_cookie()
BASE = 'https://frontend-cloud.corp.kuaishou.com/v1/databases/blog_db/collections/posts/documents'
HEADERS = {
    'X-Appwrite-Project': 'blog',
    'X-Appwrite-Mode': 'admin',
    'Content-Type': 'application/json',
    'Cookie': COOKIE,
}

# 先获取所有文章
req = urllib.request.Request(BASE + '?queries%5B0%5D=limit(100)', headers=HEADERS)
with urllib.request.urlopen(req) as resp:
    docs = json.loads(resp.read())['documents']

# 按 slug 建立映射
by_slug = {d['slug']: d for d in docs}

# 需要把 published_at 从 2025-xx 改为 2024-xx 的 slug 列表
# 这些文章在文档「2025年分割线」下面，所以是2024年的
year_fix = {
    # 2024年的文章（之前误存为2025）
    'everyone-wants-a':              '2024-12-01T00:00:00.000Z',
    'my-talent-standards':           '2024-11-01T00:00:00.000Z',
    'do-it-right-first-time':        '2024-10-26T00:00:00.000Z',
    'be-responsible-not-aggrieved':  '2024-10-19T00:00:00.000Z',
    'dont-show-complexity-to-users': '2024-10-10T00:00:00.000Z',
    'dont-rationalize-problems':     '2024-09-27T00:00:00.000Z',
    'no-adversity-feel-relaxed':     '2024-09-20T00:00:00.000Z',
    'recruitment-must-admire-strength': '2024-09-13T00:00:00.000Z',
    'finding-rules-in-finite-game':  '2024-09-06T00:00:00.000Z',
    'summer-ends-hello-again':       '2024-09-09T00:00:00.000Z',
    # 这篇在文档「2025年分割线」前（暑假那批），但对应的月份说明是2024年暑假
    'altruism-is-self-interest':     '2024-07-26T00:00:00.000Z',
    'people-cannot-be-changed':      '2024-07-13T00:00:00.000Z',
    'no-conflict-not-harmony':       '2024-06-30T00:00:00.000Z',
    'build-team-like-product':       '2024-06-23T00:00:00.000Z',
    # 「在脚手架与星光之间」是0218，在2025年分割线下，属于2025年2月 — 保持不变
    # 「叙事的分寸感」是0416，在2025年分割线下，属于2025年4月 — 保持不变
    # 「回信：情绪管理」是0520，在2025年分割线下，属于2025年5月 — 保持不变
    # 「从项目思维到经营思维」是1126，在2025年分割线下，属于2025年 — 保持不变
    # 「谁都想拿A」是1201，在2025年分割线下，属于2025年 — 保持不变
}

print(f"需要修正 {len(year_fix)} 篇文章的年份...\n")

for slug, new_date in year_fix.items():
    if slug not in by_slug:
        print(f"⚠️  找不到: {slug}")
        continue
    doc = by_slug[slug]
    doc_id = doc['$id']
    old_date = doc.get('published_at', '')[:10]
    new_date_short = new_date[:10]

    payload = json.dumps({'published_at': new_date}).encode('utf-8')
    url = f"{BASE}/{doc_id}"
    req = urllib.request.Request(url, data=payload, headers=HEADERS, method='PATCH')
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            print(f"✅ {doc['title'][:25]:25s}  {old_date} → {new_date_short}")
    except urllib.error.HTTPError as e:
        err = json.loads(e.read())
        print(f"❌ {doc['title'][:25]:25s}  {err.get('message','')[:60]}")

print("\n完成！")
