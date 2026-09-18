#!/usr/bin/env bash
# 将当前 master 分支合并到 main（本地创建 main，再推送；若远端 main 已有内容则先合并）
set -e
cd /Users/zhangwenhao/npm/site-html

# 确认当前在 master
CUR=$(git symbolic-ref --short HEAD)
if [ "$CUR" != "master" ]; then
  echo "当前分支是 $CUR，不是 master，先切回 master"
  git checkout master
fi

# 1. 基于 master 创建（或切到）main
if git rev-parse --verify main >/dev/null 2>&1; then
  git checkout main
  git merge master --no-edit
else
  git checkout -b main
fi

# 2. 若远端 main 已存在且历史不同，拉取并合并（保留旧历史）
if git rev-parse --verify origin/main >/dev/null 2>&1; then
  git fetch origin main
  git merge origin/main --allow-unrelated-histories -m "Merge master into main" || {
    echo "合并远端 main 有冲突，请手动解决后 git push -u origin main"
    exit 1
  }
fi

# 3. 推送 main 并建立跟踪
git push -u origin main
echo "完成：main 已包含 master 的内容并推送到 origin。"
