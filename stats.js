/* 学习统计推导（v4.3 交接 F1、F2、F3）。
 *
 * 三个纯函数族，全部从既有 state.daily 与每课 activeSeconds 推导，
 * **不新增任何存储字段**（交接 F2“优先纯函数从 daily 推导，避免 schema 膨胀”）：
 *   heatmapWeeks   GitHub 风格学习热力图（近 N 周，默认 17 周 ≈ 4 个月）
 *   personalBests  个人最佳记录（当前/历史最长连续、单日最高、近 7/30 天、
 *                  累计学习天数、本周 vs 上周）
 *   lessonTimes    每课学习耗时排行（Top N；耗时是学习痕迹，不是好坏评价）
 *
 * 热力图强度用**固定档位**（0 / <15 分 / 15–30 / 30–60 / ≥60 分钟）：
 * 档位含义跨档案稳定、可解释，不随个人最大值浮动（动态分位会让
 * “同样学 40 分钟”在不同时期显示不同颜色，误导回顾）。
 *
 * 日期运算全部走 UTC 平移（与 daily.js / progress.js 同一规则），
 * 跨月、跨年、闰年（2 月 29 日）都由 Date.UTC 归一化处理。
 *
 * 设计：纯逻辑，不依赖 DOM 与存储；依赖 daily.js 的日期函数（加载顺序
 * daily.js 之后）。可在 Node 直接测试（tests/stats-review.test.cjs）。 */
(() => {
  'use strict';

  const dailyModule = (typeof window !== 'undefined' && window.ODIN_DAILY) || null;

  /* 与 progress.js 的 STREAK_MIN_DAY_SECONDS 一致（测试钉住不漂移） */
  const STUDY_DAY_MIN_SECONDS = 600;
  const HEATMAP_DEFAULT_WEEKS = 17;

  /* 热力图强度档位：0 = 无记录；1–4 按固定分钟阈值 */
  const HEATMAP_LEVELS = [
    { level: 1, minSeconds: 1, zh: '不足 15 分钟' },
    { level: 2, minSeconds: 15 * 60, zh: '15–30 分钟' },
    { level: 3, minSeconds: 30 * 60, zh: '30–60 分钟' },
    { level: 4, minSeconds: 60 * 60, zh: '60 分钟以上' }
  ];

  function shiftDayKeyLocal(dayKey, delta) {
    const [year, month, day] = String(dayKey).split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day + delta)).toISOString().slice(0, 10);
  }

  function mondayOfLocal(dayKey) {
    if (dailyModule) return dailyModule.mondayOf(dayKey);
    const [year, month, day] = String(dayKey).split('-').map(Number);
    const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
    const back = weekday === 0 ? 6 : weekday - 1;
    return shiftDayKeyLocal(dayKey, -back);
  }

  function levelOfSeconds(seconds) {
    const value = Number(seconds) || 0;
    if (value <= 0) return 0;
    let level = 1;
    for (const step of HEATMAP_LEVELS) {
      if (value >= step.minSeconds) level = step.level;
    }
    return level;
  }

  /* ---------- F1：近 N 周热力图（列 = ISO 周一起的周，行 = 周一→周日） ----------
   * 返回的 days 里“未来日期”（本周还没到的日子）标 isFuture，UI 灰显不计入统计；
   * monthLabels 给每列标注月份变化（该周周一所在月份与上一列不同时输出）。 */
  function heatmapWeeks(state, todayKey, weeks) {
    const total = Number.isInteger(weeks) && weeks > 0 ? Math.min(weeks, 104) : HEATMAP_DEFAULT_WEEKS;
    const daily = (state && state.daily) || {};
    const thisMonday = mondayOfLocal(todayKey);
    const startMonday = shiftDayKeyLocal(thisMonday, -(total - 1) * 7);
    const columns = [];
    const monthLabels = [];
    let previousMonth = null;
    for (let weekIndex = 0; weekIndex < total; weekIndex += 1) {
      const monday = shiftDayKeyLocal(startMonday, weekIndex * 7);
      const days = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const dayKey = shiftDayKeyLocal(monday, dayIndex);
        const seconds = Math.floor(Number(daily[dayKey]) || 0);
        days.push({
          dayKey,
          seconds,
          level: dayKey > todayKey ? 0 : levelOfSeconds(seconds),
          isToday: dayKey === todayKey,
          isFuture: dayKey > todayKey
        });
      }
      columns.push({ monday, days });
      const month = monday.slice(0, 7);
      monthLabels.push(month !== previousMonth ? month : null);
      previousMonth = month;
    }
    const studiedDays = columns.reduce((count, week) => count + week.days.filter(day => !day.isFuture && day.seconds > 0).length, 0);
    const totalSeconds = columns.reduce((sum, week) => sum + week.days.reduce((acc, day) => acc + (day.isFuture ? 0 : day.seconds), 0), 0);
    return {
      todayKey,
      weeks: total,
      startMonday,
      columns,
      monthLabels,
      studiedDays,
      totalSeconds,
      /* 空态：整个窗口一天都没有记录（UI 给清楚的空态提示而不是灰一片） */
      isEmpty: studiedDays === 0
    };
  }

  /* ---------- F2：个人最佳记录 ---------- */

  /* 从某天往回数连续达标天数（与 progress.js streakOf 同一语义：
   * 今天没达标不打断昨天为止的连续；tests 钉住两边结果一致）。 */
  function streakAt(state, dayKey) {
    const daily = (state && state.daily) || {};
    const reached = key => Number(daily[key]) >= STUDY_DAY_MIN_SECONDS;
    let cursor = reached(dayKey) ? dayKey : shiftDayKeyLocal(dayKey, -1);
    let count = 0;
    while (reached(cursor)) {
      count += 1;
      cursor = shiftDayKeyLocal(cursor, -1);
    }
    return count;
  }

  /* 历史最长连续达标学习（uhabits 的 longest streak 思路）：
   * 把达标日排序后扫连续段。返回 { days, endDay }。 */
  function longestStreak(state) {
    const daily = (state && state.daily) || {};
    const reachedDays = Object.keys(daily)
      .filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key) && Number(daily[key]) >= STUDY_DAY_MIN_SECONDS)
      .sort();
    let best = 0;
    let bestEnd = null;
    let run = 0;
    let previous = null;
    for (const day of reachedDays) {
      run = previous !== null && shiftDayKeyLocal(previous, 1) === day ? run + 1 : 1;
      if (run > best) {
        best = run;
        bestEnd = day;
      }
      previous = day;
    }
    return { days: best, endDay: bestEnd };
  }

  function personalBests(state, todayKey) {
    const daily = (state && state.daily) || {};
    const sumRange = days => days.reduce((total, key) => total + (Math.floor(Number(daily[key]) || 0)), 0);
    const lastNDays = n => Array.from({ length: n }, (_, index) => shiftDayKeyLocal(todayKey, -index));
    const thisMonday = mondayOfLocal(todayKey);
    const thisWeek = Array.from({ length: 7 }, (_, index) => shiftDayKeyLocal(thisMonday, index));
    const lastWeek = Array.from({ length: 7 }, (_, index) => shiftDayKeyLocal(thisMonday, index - 7));
    let bestDaySeconds = 0;
    let bestDayKey = null;
    for (const [day, seconds] of Object.entries(daily)) {
      const value = Math.floor(Number(seconds) || 0);
      if (value > bestDaySeconds) {
        bestDaySeconds = value;
        bestDayKey = day;
      }
    }
    const thisWeekSeconds = sumRange(thisWeek);
    const lastWeekSeconds = sumRange(lastWeek);
    const longest = longestStreak(state);
    /* v4.3 Batch 10（Stretch N1）：近 30 天一致率——uhabits habit strength 的
     * 刻意简化版：可解释的百分比（30 天里有几天达标），不做指数加权分数。 */
    const last30 = lastNDays(30);
    const last30StudyDays = last30.filter(key => Number(daily[key]) >= STUDY_DAY_MIN_SECONDS).length;
    return {
      todayKey,
      currentStreak: streakAt(state, todayKey),
      longestStreakDays: longest.days,
      longestStreakEndDay: longest.endDay,
      bestDaySeconds,
      bestDayKey,
      last7Seconds: sumRange(lastNDays(7)),
      last30Seconds: sumRange(last30),
      totalStudyDays: Object.values(daily).filter(seconds => Number(seconds) >= STUDY_DAY_MIN_SECONDS).length,
      thisWeekSeconds,
      lastWeekSeconds,
      weekChangePct: lastWeekSeconds > 0 ? Math.round(((thisWeekSeconds - lastWeekSeconds) / lastWeekSeconds) * 100) : null,
      last30StudyDays,
      consistencyPct: Math.round((last30StudyDays / 30) * 100)
    };
  }

  /* v4.3 Batch 10（Stretch N4）：今天之前的单日最高纪录（个人纪录刷新提示用：
   * 今天秒数超过它才提示“新纪录”，纯推导无闩锁——提示只在破纪录当天出现）。 */
  function bestDayBefore(state, todayKey) {
    const daily = (state && state.daily) || {};
    let best = 0;
    let bestKey = null;
    for (const [day, seconds] of Object.entries(daily)) {
      if (day === todayKey) continue;
      const value = Math.floor(Number(seconds) || 0);
      if (value > best) {
        best = value;
        bestKey = day;
      }
    }
    return bestKey ? { dayKey: bestKey, seconds: best } : null;
  }

  /* ---------- F3：每课学习耗时排行 ----------
   * 只统计真实记录过时长的课；耗时长短不是好坏评价（交接 F3），
   * UI 文案负责把这一点说清楚。 */
  function lessonTimes(state, lessons, limit) {
    const wanted = Number.isInteger(limit) && limit > 0 ? limit : 5;
    const entries = (Array.isArray(lessons) ? lessons : [])
      .map(lesson => {
        const entry = ((state && state.lessons) || {})[lesson.id] || {};
        return { lessonId: lesson.id, zh: lesson.zh, title: lesson.title, seconds: Math.floor(Number(entry.activeSeconds) || 0) };
      })
      .filter(item => item.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds || String(a.zh).localeCompare(String(b.zh), 'zh'));
    return {
      top: entries.slice(0, wanted),
      timedLessonCount: entries.length,
      totalSeconds: entries.reduce((sum, item) => sum + item.seconds, 0)
    };
  }

  /* ---------- Stretch N11/N12：学习总结 Markdown（打印总结的同源数据） ----------
   * 入参是 app.js collectSummaryData() 组装的纯数据（字符串数组），本函数只做
   * Markdown 拼装——保持“数据在 UI 层、拼装在逻辑层”的可测试边界。 */
  function summaryMarkdown(data) {
    const d = data || {};
    const lines = [];
    const section = (title, items) => {
      if (!items || !items.length) return;
      lines.push(`## ${title}`, '');
      items.forEach(text => lines.push(`- ${text}`));
      lines.push('');
    };
    lines.push(`# ${(d.title) || '学习总结'}（${d.generatedDay || ''}）`, '');
    if (d.intro) lines.push(d.intro, '');
    section('总览', d.overview);
    section('个人最佳', d.bests);
    section('本周总结', d.week);
    if (d.heatLine) lines.push(`## 近 ${d.heatWeeks || 17} 周`, '', d.heatLine, '');
    if (d.times && d.times.length) {
      lines.push('## 最花时间的 5 课', '');
      d.times.forEach((text, index) => lines.push(`${index + 1}. ${text}`));
      lines.push('');
    }
    section('循环成就（铜 / 银 / 金）', d.tiers);
    section('最近学习历史', d.history);
    lines.push('---', '', d.footer || '本页由学习档案实时生成：所有数字都来自这台设备上的真实学习记录，不含任何联网数据。');
    return lines.join('\n');
  }

  window.ODIN_STATS = {
    STUDY_DAY_MIN_SECONDS, HEATMAP_DEFAULT_WEEKS, HEATMAP_LEVELS,
    levelOfSeconds, heatmapWeeks, streakAt, longestStreak, personalBests, bestDayBefore, lessonTimes,
    summaryMarkdown
  };
})();
