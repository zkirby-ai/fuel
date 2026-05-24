'use client';

import { useEffect, useMemo, useState } from 'react';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Drink';
type Tab = 'today' | 'log' | 'history';
type StomachStatus = 'Good' | 'Okay' | 'Off' | 'Hurting';
type MealReaction = 'Fine' | 'Bloated' | 'Crampy' | 'Reflux' | 'Nauseous';

type FoodEntry = {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number;
  note?: string;
  timeLabel: string;
  dateKey: string;
  reaction?: MealReaction | null;
};

type DayStatusMap = Record<string, { stomach: StomachStatus | null; note?: string }>;

const SAMPLE_ENTRIES: FoodEntry[] = [
  { id: '1', name: 'Greek yogurt + berries', mealType: 'Breakfast', calories: 320, protein: 27, timeLabel: '8:40 AM', dateKey: 'sample', reaction: 'Fine' },
  { id: '2', name: 'Chicken rice bowl', mealType: 'Lunch', calories: 610, protein: 46, timeLabel: '1:15 PM', dateKey: 'sample', reaction: 'Fine' },
  { id: '3', name: 'Protein shake', mealType: 'Snack', calories: 210, protein: 30, timeLabel: '4:20 PM', dateKey: 'sample', reaction: 'Bloated' },
];

const QUICK_ADD = [
  { name: 'Protein shake', mealType: 'Snack' as MealType, calories: 210, protein: 30 },
  { name: 'Greek yogurt bowl', mealType: 'Breakfast' as MealType, calories: 300, protein: 25 },
  { name: 'Eggs + toast', mealType: 'Breakfast' as MealType, calories: 420, protein: 24 },
  { name: 'Chicken rice bowl', mealType: 'Lunch' as MealType, calories: 610, protein: 46 },
];

const STOMACH_OPTIONS: StomachStatus[] = ['Good', 'Okay', 'Off', 'Hurting'];
const REACTION_OPTIONS: MealReaction[] = ['Fine', 'Bloated', 'Crampy', 'Reflux', 'Nauseous'];

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadEntries(): FoodEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('fuel-entries');
    return raw ? (JSON.parse(raw) as FoodEntry[]) : [];
  } catch {
    return [];
  }
}

function loadDayStatus(): DayStatusMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem('fuel-day-status');
    return raw ? (JSON.parse(raw) as DayStatusMap) : {};
  } catch {
    return {};
  }
}

export default function HomePage() {
  const todayKey = localDateKey();
  const [tab, setTab] = useState<Tab>('today');
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [dayStatus, setDayStatus] = useState<DayStatusMap>({});
  const [draft, setDraft] = useState({
    name: '',
    mealType: 'Dinner' as MealType,
    calories: '',
    protein: '',
    note: '',
    reaction: 'Fine' as MealReaction,
  });

  useEffect(() => {
    const savedEntries = loadEntries();
    const savedDayStatus = loadDayStatus();
    setEntries(savedEntries.length ? savedEntries : SAMPLE_ENTRIES.map((entry) => ({ ...entry, dateKey: todayKey })));
    setDayStatus(savedDayStatus);
  }, [todayKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('fuel-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('fuel-day-status', JSON.stringify(dayStatus));
  }, [dayStatus]);

  const todaysEntries = useMemo(
    () => entries.filter((entry) => entry.dateKey === todayKey),
    [entries, todayKey]
  );

  const todaysStatus = dayStatus[todayKey] ?? { stomach: null, note: '' };

  const totals = useMemo(() => {
    const calories = todaysEntries.reduce((sum, entry) => sum + entry.calories, 0);
    const protein = todaysEntries.reduce((sum, entry) => sum + entry.protein, 0);
    return { calories, protein };
  }, [todaysEntries]);

  const historyStats = useMemo(() => {
    const grouped = new Map<string, FoodEntry[]>();
    for (const entry of entries) {
      const list = grouped.get(entry.dateKey) ?? [];
      list.push(entry);
      grouped.set(entry.dateKey, list);
    }
    const days = [...grouped.values()];
    const statuses = Object.values(dayStatus).map((item) => item.stomach).filter(Boolean) as StomachStatus[];
    if (days.length === 0) return { avgProtein: 0, avgCalories: 0, bestProtein: 0, stomachBadDays: 0, topReaction: '—' };
    const proteinDays = days.map((day) => day.reduce((sum, entry) => sum + entry.protein, 0));
    const calorieDays = days.map((day) => day.reduce((sum, entry) => sum + entry.calories, 0));
    const badDays = statuses.filter((status) => status === 'Off' || status === 'Hurting').length;
    const reactionCounts = new Map<string, number>();
    for (const entry of entries) {
      if (!entry.reaction || entry.reaction === 'Fine') continue;
      reactionCounts.set(entry.reaction, (reactionCounts.get(entry.reaction) ?? 0) + 1);
    }
    const topReaction = [...reactionCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return {
      avgProtein: Math.round(proteinDays.reduce((a, b) => a + b, 0) / proteinDays.length),
      avgCalories: Math.round(calorieDays.reduce((a, b) => a + b, 0) / calorieDays.length),
      bestProtein: Math.max(...proteinDays),
      stomachBadDays: badDays,
      topReaction,
    };
  }, [entries, dayStatus]);

  const proteinTarget = 180;
  const calorieTarget = 2400;

  function addQuick(entry: (typeof QUICK_ADD)[number]) {
    setEntries((current) => [
      {
        id: crypto.randomUUID(),
        name: entry.name,
        mealType: entry.mealType,
        calories: entry.calories,
        protein: entry.protein,
        timeLabel: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        dateKey: todayKey,
        reaction: 'Fine',
      },
      ...current,
    ]);
  }

  function addManual() {
    if (!draft.name.trim()) return;
    setEntries((current) => [
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        mealType: draft.mealType,
        calories: Number(draft.calories) || 0,
        protein: Number(draft.protein) || 0,
        note: draft.note.trim() || undefined,
        timeLabel: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        dateKey: todayKey,
        reaction: draft.reaction,
      },
      ...current,
    ]);
    setDraft({ name: '', mealType: 'Dinner', calories: '', protein: '', note: '', reaction: 'Fine' });
    setTab('today');
  }

  function updateTodayStatus(stomach: StomachStatus | null) {
    setDayStatus((current) => ({
      ...current,
      [todayKey]: { ...(current[todayKey] ?? {}), stomach },
    }));
  }

  function updateTodayNote(note: string) {
    setDayStatus((current) => ({
      ...current,
      [todayKey]: { ...(current[todayKey] ?? {}), stomach: current[todayKey]?.stomach ?? null, note },
    }));
  }

  return (
    <main className="shell">
      <header className="hero card">
        <p className="eyebrow">Fuel</p>
        <h1>Low-friction food logging.</h1>
        <p className="lede">Track meals, protein, and whether your stomach feels bad — without turning this into a medical spreadsheet.</p>
      </header>

      <nav className="tabRow" aria-label="Sections">
        <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>Today</button>
        <button className={tab === 'log' ? 'active' : ''} onClick={() => setTab('log')}>Log</button>
        <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>History</button>
      </nav>

      {tab === 'today' ? (
        <>
          <section className="card totalsCard">
            <div className="totalStat">
              <span>Calories</span>
              <strong>{totals.calories}</strong>
              <small>{calorieTarget - totals.calories > 0 ? `${calorieTarget - totals.calories} left` : 'Target hit'}</small>
            </div>
            <div className="totalStat accent">
              <span>Protein</span>
              <strong>{totals.protein}g</strong>
              <small>{proteinTarget - totals.protein > 0 ? `${proteinTarget - totals.protein}g to target` : 'Target hit'}</small>
            </div>
          </section>

          <section className="card stomachCard">
            <div className="sectionHead">
              <div>
                <p className="eyebrow">Today</p>
                <h2>Stomach status</h2>
              </div>
            </div>
            <div className="statusChips">
              {STOMACH_OPTIONS.map((status) => (
                <button
                  key={status}
                  className={`statusChip ${todaysStatus.stomach === status ? 'active' : ''}`}
                  onClick={() => updateTodayStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <textarea
              className="statusNote"
              value={todaysStatus.note ?? ''}
              onChange={(e) => updateTodayNote(e.target.value)}
              placeholder="Optional note: stomach hurt after lunch / dairy seemed bad / felt fine until late night"
            />
          </section>

          <section className="card quickAddCard">
            <div className="sectionHead">
              <div>
                <p className="eyebrow">Quick add</p>
                <h2>Repeatable meals</h2>
              </div>
            </div>
            <div className="quickGrid">
              {QUICK_ADD.map((item) => (
                <button key={item.name} className="quickTile" onClick={() => addQuick(item)}>
                  <strong>{item.name}</strong>
                  <span>{item.calories} cal · {item.protein}g protein</span>
                </button>
              ))}
            </div>
          </section>

          <section className="card entriesCard">
            <div className="sectionHead">
              <div>
                <p className="eyebrow">Today</p>
                <h2>Meals logged</h2>
              </div>
            </div>
            <div className="entryList">
              {todaysEntries.map((entry) => (
                <article className="entryRow" key={entry.id}>
                  <div>
                    <p className="mealType">{entry.mealType} · {entry.timeLabel}</p>
                    <h3>{entry.name}</h3>
                    <div className="reactionRow">
                      <span className={`reactionTag ${entry.reaction && entry.reaction !== 'Fine' ? 'warn' : ''}`}>{entry.reaction ?? 'Fine'}</span>
                    </div>
                    {entry.note ? <p className="note">{entry.note}</p> : null}
                  </div>
                  <div className="entryMeta">
                    <strong>{entry.protein}g</strong>
                    <span>{entry.calories} cal</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {tab === 'log' ? (
        <section className="card formCard">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">Manual log</p>
              <h2>Add a meal</h2>
            </div>
          </div>
          <div className="formGrid">
            <label>
              <span>Food</span>
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Chicken burrito bowl" />
            </label>
            <label>
              <span>Meal type</span>
              <select value={draft.mealType} onChange={(e) => setDraft({ ...draft, mealType: e.target.value as MealType })}>
                {(['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drink'] as MealType[]).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Calories</span>
              <input inputMode="numeric" value={draft.calories} onChange={(e) => setDraft({ ...draft, calories: e.target.value })} placeholder="550" />
            </label>
            <label>
              <span>Protein (g)</span>
              <input inputMode="numeric" value={draft.protein} onChange={(e) => setDraft({ ...draft, protein: e.target.value })} placeholder="40" />
            </label>
            <label>
              <span>Stomach after</span>
              <select value={draft.reaction} onChange={(e) => setDraft({ ...draft, reaction: e.target.value as MealReaction })}>
                {REACTION_OPTIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="full">
              <span>Note</span>
              <textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Optional context: restaurant / dessert / spicy / dairy / felt too full" />
            </label>
          </div>
          <button className="primaryButton" onClick={addManual}>Log meal</button>
        </section>
      ) : null}

      {tab === 'history' ? (
        <section className="card historyCard">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">History</p>
              <h2>Recent pattern</h2>
            </div>
          </div>
          <div className="historyStats stomachHistoryStats">
            <div><span>Avg protein</span><strong>{historyStats.avgProtein}g</strong></div>
            <div><span>Avg calories</span><strong>{historyStats.avgCalories.toLocaleString()}</strong></div>
            <div><span>Best day</span><strong>{historyStats.bestProtein}g protein</strong></div>
            <div><span>Bad stomach days</span><strong>{historyStats.stomachBadDays}</strong></div>
            <div><span>Most common issue</span><strong>{historyStats.topReaction}</strong></div>
          </div>
          <p className="historyNote">This keeps it lightweight, but it should already help you notice when stomach pain clusters around certain meals or reaction types.</p>
        </section>
      ) : null}
    </main>
  );
}
