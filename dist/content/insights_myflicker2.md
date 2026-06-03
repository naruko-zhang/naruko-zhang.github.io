# 我如何用 MyFlicker 搭建了一个属于自己的 LLM Wiki
从 Karpathy 的一篇 gist，到 65 页的个人知识库，再到一条可访问的 Docs 链接——全程不到一小时。
Pt.2： [从个人到团队，我尝试用 MyFlicker 重构信息沉淀模式](https://docs.corp.kuaishou.com/k/home/VZvgnxWRYrIA/fcADNxptapDrCZEf-Tv4tWbsJ?source=kim\_broadcast)
## 起因
周五早上，老板给我发了个链接：https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
这是 Andrej Karpathy（前特斯拉 AI 总监、OpenAI 创始成员）写的一篇想法文档，叫 LLM Wiki。核心观点一句话概括：
不要让 LLM 每次从原始文档重新发现知识——让它增量构建和维护一个持久的 wiki，知识编译一次，持续复利。
这个想法击中了我。
过去一年我在公司 Docs 上写了不少东西：四封给团队的信、一个持续更新的「数字花园」、晋升辅导、校招生回信、平台 PM 培养体系……加起来超过 40 万字。但它们散落在不同的文档链接里，彼此靠手动超链接连接，没有统一索引，没有交叉引用，没有自动维护。每次想找某个观点的完整脉络，我得手动翻多个文档。
Karpathy 提出的三层架构（原始资料 → wiki → schema）和三种操作（ingest / query / lint），恰好是我想做但没能力手动做的事。
然后我意识到：我的 AI 工作伙伴 MyFlicker，能干这个。
## 我做了什么
整个过程分四步：读 → 拉 → 建 → 推。
### 第一步：读
我把 Karpathy 的 gist 链接给 MyFlicker，让它翻译和总结。它读完后告诉我核心架构和操作流程，还给出了落地方向：先做个人版，再做团队版。
### 第二步：拉
我把自己 Docs 知识库的入口链接给了 MyFlicker——MyFlicker 用 Docs Shuttle 工具（快手内网的文档同步技能）：
先搜索了我的 Docs 上所有相关文档（搜 "zhangqing11"，返回 156 个结果）
筛出 13 个核心文档（排除了通知/表格等低价值内容，和敏感的业务内容）
逐个拉取到本地 wiki/raw/ 目录
拉下来的内容包括：
团队说明书
数字花园（10 万字符，30+ 条目）
给团队的四封信（2024.08 → 2026.04）
晋升辅导、校招生回信、平台 PM 培养体系
高效协同分享
运营产品中心简介、运营设计中心介绍
小鸣的随笔记（13 万字符碎片）
这一步 MyFlicker 全自动完成，我只给了一个链接。
### 第三步：建
这是最核心的步骤——从原始文档中提取知识，构建 wiki 页面。
MyFlicker 做了三件事：
3.1 搭框架
它创建了三层架构：
raw/ — 原始资料（从 Docs 拉取的 markdown，不可变）
pages/ — LLM 维护的 wiki 页面
schema.md + index.md + log.md — wiki 基础设施
schema.md 定义了页面分类（person/concept/topic/source/timeline）、格式约定和工作流。index.md 是内容目录。log.md 是 append-only 的操作日志。
3.2 提取第一批核心页面
MyFlicker 读取每个 raw 文档，提取关键实体和概念，创建了第一批 wiki 页面。我的四封信是重点——每封信都被完整提炼成独立的 source 页面，核心观点被拆成概念页面：
第一封信 → 「像打造产品一样打造团队」
第二封信 → 「造钟者」「双循环驱动」
第三封信 → 「Context over Control」「三维价值主张」「权责利闭环」
第四封信 → 「特征降维法」「系统观察法」「模式辨识法」
3.3 全量提取数字花园
数字花园是一个 10 万字符的长文档，包含 30+ 条目（格式 #MMDD #标题）。MyFlicker 用子 agent 批量提取了所有条目，每个条目要么创建概念页面，要么创建来源索引页面。
最终数字花园 100% 提取完成。
3.4 Lint
MyFlicker 自动跑了一次健康检查：
双链完整性：所有 [[xxx]] 引用都有对应文件 ✅
孤儿页面：9 个无 inbound 链接的来源页面，通过添加引用修复 ✅
高频概念待建：识别出 15 个提及频率高但尚未有独立页面的概念
Lint 结果：65 页双链完整，无缺失。
### 第四步：推
wiki 在 MyFlicker workspace 里建好了，但我需要一个可访问的链接。MyFlicker 把 65 个页面整合成一个完整 Markdown 文档（97KB，2700 行），用 Docs Shuttle 推送到快手 Docs，我拿到了一条链接。
整个知识库现在有一个在线可访问的首页。[小鸣的个人 LLM Wiki — 知识库全览](https://docs.corp.kuaishou.com/d/home/fcABIl4dRppN\_RutKYn9XD9GT)
## 最终结果
65 个 wiki 页面，覆盖从 2024.06 到 2026.05 的全部思考轨迹：

|  |  |  |
| --- | --- | --- |
| 分类 | 数量 | 内容 |
| 人物 | 1 | 我的完整画像（性格/霍根数据/偏好/雷区） |
| 管理理念 | 13 | 团队即产品、阳谋、权责利闭环、经营思维、抽象与还原等 |
| 团队管理实践 | 9 | 绩效A标准、用人标准、慕强、一次做对、有担当不委屈等 |
| 产品方法论 | 6 | 平台PM、好产品公式、AI价值判断、PM核心价值等 |
| AI 时代思考 | 3 | 人的护城河、Token 价值、AI 赦能三原则 |
| 认知模型 | 4 | 三件套总览 + 降维/观察/辨识独立页 |
| 团队实体 | 2 | 运营产品中心、运营设计中心 |
| 来源 | 25 | 每个原始文档的提炼和概览 |
| 时间线 | 1 | 管理哲学演化轨迹 |

每个页面有双链交叉引用、来源标注、创建/更新时间。知识不再是散落的文档，而是结构化、互链、可搜索的网络。
## 和传统 RAG 的区别
Karpathy 在 gist 里说得很清楚，我也体会到了：
传统 RAG：上传文档 → 查询时检索片段 → 生成回答。每次都从原始文档重新发现知识，没有积累。
LLM Wiki：上传文档 → LLM 读取、提取、整合进现有 wiki → 查询时直接读 wiki 页面。知识编译一次，持续复利。
举个例子：我问 MyFlicker「我的管理理念核心脉络是什么」，它不需要重新翻遍 13 个原始文档。它先读 index.md 找到相关页面，然后综合 concept-team-as-product、concept-context-over-control、concept-responsibility-loop、concept-阳谋、concept-人是目的 五个页面给出回答——这些交叉引用和矛盾标注已经建好了。
这就是复利：每加一个新来源、每问一个问题，wiki 都变得更丰富，而 RAG 每次都是从零开始。
## 我的体会
人负责选材和提问，AI 负责维护。
这是 Karpathy 的核心洞察，也是我实践后的确认。维护知识库的痛苦不是阅读或思考，而是记账——更新交叉引用、保持摘要时效、标注矛盾、维护一致性。人力成本增长快于价值增长，所以人会放弃 wiki。LLM 不会无聊，不会漏更新，一次能改 15 个文件。维护成本接近零。
但人要做的事不可替代：选择什么进入知识库、决定关注什么方向、问对问题。
Karpathy 说他左边开着 LLM agent，右边开着 Obsidian，LLM 根据对话做编辑，他在 Obsidian 里实时浏览。我的体验类似——我给 MyFlicker 方向（哪些文档要拉、哪些条目要提取），它执行。我提需求（团队实体页附上原始 Docs 链接、把全量 wiki 推到 Docs），它完成。我不用写任何 wiki 页面，但我决定了 wiki 的边界和重点。
架构比功能重要。
Schema.md 看起来只是个配置文件，但它是 wiki 的「母提示词」。它告诉 LLM 页面怎么分类、格式怎么写、工作流怎么走。没有 schema，LLM 就是个聊天机器人；有了 schema，它是 disciplined wiki maintainer。这和 Karpathy 的说法一致——schema 是你和 LLM co-evolve 的文件，随着你对领域理解的加深逐步迭代。
## 下一步
这个 wiki 是活的，不是静态的。
Ingest：以后我写的任何新文档，给 MyFlicker 链接，它拉进 raw/ → 自动提取 → 更新 pages 和 index
Query：随时可以对 wiki 提问，MyFlicker 先查 index 再综合回答
Lint：定期健康检查，找矛盾、孤儿、缺失引用、过时内容
还有一个我没做但想做的：把 wiki 和我的 Docs 知识库做双向同步——wiki 有更新时自动推到 Docs，Docs 有新文档时自动触发 ingest。这样 wiki 就真的变成了 Karpathy 描述的那个「持续复利的持久产物」。
## 最后
Karpathy 在 gist 末尾说 "This document is intentionally abstract. The right way to use this is to share it with your LLM agent and work together to instantiate a version that fits your needs."
我照做了。效果比预期的好——不是因为 idea 多天才，而是因为 execution 多顺手。有个能读内网文档、能自动维护文件、能批量操作的 AI 伙伴，把一个个抽象的想法变成了可触摸的 65 页知识库。
想法不值钱，落地才值钱。而落地这件事，AI 比人擅长。
最最后，分享一个团队小伙伴用 Myflicker 落地的有趣实践，希望能给大家带来一点不一样的启发。
👉 [15分钟 + 0行代码，我给运营搓了个审核神器](https://docs.corp.kuaishou.com/k/home/VMP8bl6jMVgQ/fcAB55iaP3GGyJGFS1SDGyaYG?ro=false)
本文基于 2026 年 5 月 22 日的真实操作记录撰写。全程约 50 分钟完成从 0 到 65 页的构建。