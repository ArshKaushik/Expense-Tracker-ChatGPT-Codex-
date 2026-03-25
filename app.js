const storageKey = 'expense-tracker-items-v1';

const expenseForm = document.getElementById('expenseForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const formError = document.getElementById('formError');

const totalSpentEl = document.getElementById('totalSpent');
const monthSpentEl = document.getElementById('monthSpent');
const topCategoryEl = document.getElementById('topCategory');

const expenseList = document.getElementById('expenseList');
const emptyState = document.getElementById('emptyState');
const filterCategory = document.getElementById('filterCategory');
const clearAllBtn = document.getElementById('clearAll');
const template = document.getElementById('expenseItemTemplate');

let expenses = loadExpenses();

expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formError.textContent = '';

  const description = descriptionInput.value.trim();
  const amount = Number.parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (!description || !category || !Number.isFinite(amount) || amount <= 0) {
    formError.textContent = 'Please enter a description, amount, and category.';
    return;
  }

  expenses.unshift({
    id: crypto.randomUUID(),
    description,
    amount,
    category,
    createdAt: new Date().toISOString(),
  });

  persistExpenses();
  expenseForm.reset();
  render();
});

filterCategory.addEventListener('change', render);

clearAllBtn.addEventListener('click', () => {
  if (!expenses.length) return;

  const confirmed = window.confirm('Delete all saved expenses?');
  if (!confirmed) return;

  expenses = [];
  persistExpenses();
  render();
});

function loadExpenses() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistExpenses() {
  localStorage.setItem(storageKey, JSON.stringify(expenses));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function monthKey(date) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
}

function calculateSummary(items) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const currentMonth = monthKey(new Date());

  const monthTotal = items.reduce((sum, item) => {
    const sameMonth = monthKey(new Date(item.createdAt)) === currentMonth;
    return sameMonth ? sum + item.amount : sum;
  }, 0);

  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return { total, monthTotal, topCategory };
}

function render() {
  expenseList.innerHTML = '';
  const filter = filterCategory.value;

  const visibleItems =
    filter === 'all' ? expenses : expenses.filter((item) => item.category === filter);

  const summary = calculateSummary(expenses);
  totalSpentEl.textContent = formatCurrency(summary.total);
  monthSpentEl.textContent = formatCurrency(summary.monthTotal);
  topCategoryEl.textContent = summary.topCategory;

  if (!visibleItems.length) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  for (const item of visibleItems) {
    const node = template.content.cloneNode(true);
    node.querySelector('h3').textContent = item.description;
    node.querySelector('.amount').textContent = formatCurrency(item.amount);
    node.querySelector('.meta').textContent = `${item.category} • ${new Date(item.createdAt).toLocaleDateString()}`;

    node.querySelector('.btn.icon').addEventListener('click', () => {
      expenses = expenses.filter((existing) => existing.id !== item.id);
      persistExpenses();
      render();
    });

    expenseList.append(node);
  }
}

render();
