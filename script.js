/* =========================================================
   FINORA AI — APPLICATION LOGIC
   HTML + CSS + JavaScript + LocalStorage
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "finoraExpenseData";
const THEME_KEY = "finoraTheme";


const defaultData = {

    income: 30000,

    budget: 20000,

    savingsGoal: 10000,

    expenses: [

        {
            id: crypto.randomUUID(),
            name: "Swiggy",
            amount: 450,
            category: "Food",
            date: "2026-10-02",
            ai: true
        },

        {
            id: crypto.randomUUID(),
            name: "Uber",
            amount: 280,
            category: "Transport",
            date: "2026-10-03",
            ai: true
        },

        {
            id: crypto.randomUUID(),
            name: "Amazon",
            amount: 1299,
            category: "Shopping",
            date: "2026-10-04",
            ai: true
        },

        {
            id: crypto.randomUUID(),
            name: "Netflix",
            amount: 649,
            category: "Entertainment",
            date: "2026-10-05",
            ai: true
        }

    ],

    documents: []

};


let data =
    JSON.parse(localStorage.getItem(STORAGE_KEY))
    || defaultData;


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


/* =========================================================
   HELPERS
========================================================= */

const money = value => {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value || 0);

};


function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


function formatDate(date) {

    if (!date) return "-";

    return new Date(date + "T00:00:00")
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    document.getElementById(
        "toastMessage"
    ).textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================================================
   AI CATEGORY DETECTION
========================================================= */

function autoCategory(name) {

    const text =
        name.toLowerCase();

    const categories = {

        Food: [
            "swiggy",
            "zomato",
            "restaurant",
            "food",
            "pizza",
            "burger",
            "cafe",
            "dominos",
            "mcdonald"
        ],

        Transport: [
            "uber",
            "ola",
            "rapido",
            "metro",
            "bus",
            "train",
            "petrol",
            "fuel",
            "parking"
        ],

        Shopping: [
            "amazon",
            "flipkart",
            "myntra",
            "shopping",
            "mall",
            "ajio",
            "meesho"
        ],

        Entertainment: [
            "netflix",
            "spotify",
            "movie",
            "cinema",
            "prime",
            "youtube",
            "gaming",
            "steam"
        ],

        Bills: [
            "electricity",
            "water",
            "internet",
            "wifi",
            "mobile",
            "recharge",
            "bill"
        ],

        Health: [
            "pharmacy",
            "hospital",
            "doctor",
            "medicine",
            "medical",
            "apollo"
        ],

        Education: [
            "course",
            "udemy",
            "coursera",
            "book",
            "college",
            "education",
            "tuition"
        ]

    };


    for (const category in categories) {

        for (const keyword of categories[category]) {

            if (text.includes(keyword)) {

                return category;

            }

        }

    }

    return "Other";
}


/* =========================================================
   NAVIGATION
========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");

const sections =
    document.querySelectorAll(".section");


const pageTitles = {

    dashboard: [
        "Dashboard",
        "Understand your money. Improve your habits."
    ],

    transactions: [
        "Transactions",
        "Search, sort and manage your spending."
    ],

    analytics: [
        "Analytics",
        "Understand where your money goes."
    ],

    documents: [
        "Documents",
        "Your uploaded financial documents."
    ],

    settings: [
        "Settings",
        "Configure your financial goals."
    ]

};


function navigate(sectionName) {

    sections.forEach(section => {

        section.classList.toggle(
            "active",
            section.id === sectionName
        );

    });


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionName
        );

    });


    document.getElementById("pageTitle")
        .textContent =
        pageTitles[sectionName][0];


    document.getElementById("pageSubtitle")
        .textContent =
        pageTitles[sectionName][1];


    document.querySelector(
        ".sidebar"
    ).classList.remove("open");

}


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => navigate(item.dataset.section)
    );

});


document.querySelectorAll("[data-go]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => navigate(button.dataset.go)
        );

    });


document.getElementById("mobileMenu")
    .addEventListener(
        "click",
        () => {

            document
                .querySelector(".sidebar")
                .classList.toggle("open");

        }
    );


/* =========================================================
   THEME
========================================================= */

let currentTheme =
    localStorage.getItem(THEME_KEY)
    || "dark";


function applyTheme(theme) {

    document.body.classList.remove(
        "light",
        "orange"
    );

    if (theme === "light") {

        document.body.classList.add("light");

    }

    if (theme === "orange") {

        document.body.classList.add("orange");

    }

    currentTheme = theme;

    localStorage.setItem(
        THEME_KEY,
        theme
    );

}


applyTheme(currentTheme);


document.getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            const themes = [
                "dark",
                "light",
                "orange"
            ];

            const index =
                themes.indexOf(currentTheme);

            const next =
                themes[
                    (index + 1)
                    % themes.length
                ];

            applyTheme(next);

            showToast(
                `Theme changed to ${next}`
            );

        }
    );


/* =========================================================
   DASHBOARD CALCULATIONS
========================================================= */

function getCurrentMonthExpenses() {

    const now = new Date();

    const month =
        now.getMonth();

    const year =
        now.getFullYear();


    return data.expenses.filter(expense => {

        const date =
            new Date(
                expense.date + "T00:00:00"
            );

        return (
            date.getMonth() === month &&
            date.getFullYear() === year
        );

    });

}


function calculateTotals() {

    const expenses =
        getCurrentMonthExpenses();

    const spent =
        expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount),
            0
        );


    const remaining =
        Math.max(
            data.income - spent,
            0
        );


    const budgetPercent =
        data.budget
            ? (spent / data.budget) * 100
            : 0;


    const savingsPercent =
        data.savingsGoal
            ? (Math.max(remaining, 0)
                / data.savingsGoal) * 100
            : 0;


    return {
        expenses,
        spent,
        remaining,
        budgetPercent,
        savingsPercent
    };

}


/* =========================================================
   RENDER DASHBOARD
========================================================= */

function renderDashboard() {

    const totals =
        calculateTotals();


    document.getElementById(
        "incomeValue"
    ).textContent =
        money(data.income);


    document.getElementById(
        "spentValue"
    ).textContent =
        money(totals.spent);


    document.getElementById(
        "remainingValue"
    ).textContent =
        money(totals.remaining);


    document.getElementById(
        "savingsValue"
    ).textContent =
        money(data.savingsGoal);


    document.getElementById(
        "spentPercent"
    ).textContent =
        `${Math.round(totals.budgetPercent)}% of budget`;


    document.getElementById(
        "savingsPercent"
    ).textContent =
        `${Math.min(
            100,
            Math.round(totals.savingsPercent)
        )}% achievable`;


    document.getElementById(
        "budgetSpent"
    ).textContent =
        money(totals.spent);


    document.getElementById(
        "budgetTotal"
    ).textContent =
        money(data.budget);


    const progress =
        Math.min(
            totals.budgetPercent,
            100
        );


    document.getElementById(
        "budgetProgress"
    ).style.width =
        `${progress}%`;


    let status =
        "Budget healthy";


    if (totals.budgetPercent >= 100) {

        status = "⚠ Budget exceeded";

    } else if (totals.budgetPercent >= 80) {

        status = "⚠ Getting close";

    }


    document.getElementById(
        "budgetStatus"
    ).textContent = status;


    const daysLeft =
        Math.max(
            1,
            new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
            ).getDate()
            - new Date().getDate()
            + 1
        );


    const safeDaily =
        Math.max(
            0,
            data.budget - totals.spent
        ) / daysLeft;


    document.getElementById(
        "safeDaily"
    ).textContent =
        `${money(safeDaily)}/day`;


    renderRecentTransactions(
        totals.expenses
    );

    renderCategories(
        totals.expenses
    );

    generateInsight(
        totals.expenses,
        totals.spent
    );

    renderAnalytics(
        totals.expenses
    );

}


/* =========================================================
   RECENT TRANSACTIONS
========================================================= */

function renderRecentTransactions(expenses) {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    const sorted =
        [...expenses]
            .sort(
                (a,b) =>
                    new Date(b.date)
                    - new Date(a.date)
            )
            .slice(0,5);


    if (!sorted.length) {

        container.innerHTML = `
            <div class="empty-state">
                No transactions this month.
            </div>
        `;

        return;

    }


    container.innerHTML =
        sorted.map(expense => `

            <div class="transaction-item">

                <div class="transaction-left">

                    <div class="transaction-icon">
                        ${getCategoryIcon(expense.category)}
                    </div>

                    <div>

                        <div class="transaction-name">
                            ${escapeHTML(expense.name)}
                        </div>

                        <div class="transaction-meta">
                            ${escapeHTML(expense.category)}
                            •
                            ${formatDate(expense.date)}
                        </div>

                    </div>

                </div>

                <div class="transaction-amount">
                    ${money(expense.amount)}
                </div>

            </div>

        `).join("");

}


/* =========================================================
   CATEGORY BREAKDOWN
========================================================= */

function getCategoryTotals(expenses) {

    const totals = {};

    expenses.forEach(expense => {

        totals[expense.category] =
            (totals[expense.category] || 0)
            + Number(expense.amount);

    });

    return totals;

}


function renderCategories(expenses) {

    const container =
        document.getElementById(
            "categoryBreakdown"
        );


    const totals =
        getCategoryTotals(expenses);


    const entries =
        Object.entries(totals)
            .sort(
                (a,b) => b[1] - a[1]
            );


    if (!entries.length) {

        container.innerHTML =
            `<div class="empty-state">
                No spending data yet.
            </div>`;

        return;

    }


    const max =
        entries[0][1];


    container.innerHTML =
        entries.map(([category, amount]) => `

            <div class="category-row">

                <div class="category-top">

                    <span>
                        ${escapeHTML(category)}
                    </span>

                    <span>
                        ${money(amount)}
                    </span>

                </div>

                <div class="category-bar">

                    <div style="
                        width:${(amount / max) * 100}%;
                    "></div>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   AI INSIGHTS
========================================================= */

function generateInsight(expenses, spent) {

    const container =
        document.getElementById(
            "aiInsight"
        );


    if (!expenses.length) {

        container.textContent =
            "Add transactions to generate your personalized spending analysis.";

        return;

    }


    const totals =
        getCategoryTotals(expenses);


    const topCategory =
        Object.entries(totals)
            .sort(
                (a,b) => b[1] - a[1]
            )[0];


    const percentage =
        data.budget
            ? Math.round(
                (spent / data.budget) * 100
            )
            : 0;


    let message =
        `You spent ${money(spent)} this month. `;


    if (topCategory) {

        message +=
            `${topCategory[0]} is your highest spending category at ${money(topCategory[1])}. `;

    }


    if (percentage >= 90) {

        message +=
            "You're very close to your monthly budget. Consider reducing non-essential purchases.";

    } else if (percentage >= 70) {

        message +=
            "Your spending is moderately high. Keep an eye on discretionary expenses.";

    } else {

        message +=
            "Your spending is currently within a healthy range.";

    }


    container.textContent = message;

}


/* =========================================================
   ANALYTICS
========================================================= */

function renderAnalytics(expenses) {

    const container =
        document.getElementById(
            "categoryChart"
        );


    const recommendation =
        document.getElementById(
            "savingRecommendation"
        );


    const totals =
        getCategoryTotals(expenses);


    const entries =
        Object.entries(totals)
            .sort(
                (a,b) => b[1] - a[1]
            );


    const total =
        expenses.reduce(
            (sum,e) =>
                sum + Number(e.amount),
            0
        );


    if (!entries.length) {

        container.innerHTML =
            `<div class="empty-state">
                Add transactions to see analytics.
            </div>`;

    } else {

        container.innerHTML =
            entries.map(
                ([category,amount]) => {

                    const percent =
                        total
                            ? (amount / total) * 100
                            : 0;

                    return `

                        <div class="chart-row">

                            <span>
                                ${escapeHTML(category)}
                            </span>

                            <div class="chart-track">

                                <div
                                    class="chart-fill"
                                    style="
                                    width:${percent}%;
                                    "
                                ></div>

                            </div>

                            <strong>
                                ${Math.round(percent)}%
                            </strong>

                        </div>

                    `;

                }
            ).join("");

    }


    const target =
        data.savingsGoal;


    const projected =
        Math.max(
            data.income - total,
            0
        );


    recommendation.innerHTML = `

        Based on your current spending,
        you could potentially save
        <strong>${money(projected)}</strong>
        this month.

        <br><br>

        Your target is
        <strong>${money(target)}</strong>.

        ${
            projected >= target
                ? "You are on track to achieve your savings goal."
                : "Try reducing your largest discretionary category to close the gap."
        }

    `;

}


/* =========================================================
   TRANSACTION TABLE
========================================================= */

function renderTransactionTable() {

    const tbody =
        document.getElementById(
            "transactionTable"
        );


    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const sort =
        document.getElementById(
            "sortSelect"
        ).value;


    let expenses =
        [...data.expenses];


    expenses =
        expenses.filter(expense => {

            const matchesSearch =
                expense.name
                    .toLowerCase()
                    .includes(search)
                ||
                expense.category
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all"
                ||
                expense.category === category;


            return (
                matchesSearch
                &&
                matchesCategory
            );

        });


    switch(sort) {

        case "newest":

            expenses.sort(
                (a,b) =>
                    new Date(b.date)
                    - new Date(a.date)
            );

            break;


        case "oldest":

            expenses.sort(
                (a,b) =>
                    new Date(a.date)
                    - new Date(b.date)
            );

            break;


        case "high":

            expenses.sort(
                (a,b) =>
                    b.amount - a.amount
            );

            break;


        case "low":

            expenses.sort(
                (a,b) =>
                    a.amount - b.amount
            );

            break;


        case "az":

            expenses.sort(
                (a,b) =>
                    a.name.localeCompare(b.name)
            );

            break;

    }


    document.getElementById(
        "emptyTransactions"
    ).style.display =
        expenses.length ? "none" : "block";


    tbody.innerHTML =
        expenses.map(expense => `

            <tr>

                <td>
                    ${formatDate(expense.date)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(expense.name)}
                    </strong>
                </td>

                <td>
                    <span class="category-badge">
                        ${escapeHTML(expense.category)}
                    </span>
                </td>

                <td>
                    <strong>
                        ${money(expense.amount)}
                    </strong>
                </td>

                <td>

                    ${
                        expense.ai
                        ? `<span class="ai-tag">
                            ✦ Auto
                           </span>`
                        : "-"
                    }

                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense('${expense.id}')"
                    >
                        ×
                    </button>

                </td>

            </tr>

        `).join("");

}


/* =========================================================
   DELETE EXPENSE
========================================================= */

function deleteExpense(id) {

    data.expenses =
        data.expenses.filter(
            expense =>
                expense.id !== id
        );

    saveData();

    render();

    showToast(
        "Transaction deleted"
    );

}


/* =========================================================
   ADD EXPENSE
========================================================= */

const expenseModal =
    document.getElementById(
        "expenseModal"
    );


document.getElementById(
    "addExpenseBtn"
).addEventListener(
    "click",
    openExpenseModal
);


function openExpenseModal() {

    expenseModal.classList.add("show");

    document.getElementById(
        "expenseDate"
    ).value =
        new Date()
            .toISOString()
            .split("T")[0];

}


document.querySelectorAll(
    "[data-close]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    button.dataset.close
                )
                .classList.remove("show");

        }
    );

});


document.getElementById(
    "expenseForm"
).addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "expenseName"
            ).value.trim();


        const amount =
            Number(
                document.getElementById(
                    "expenseAmount"
                ).value
            );


        const date =
            document.getElementById(
                "expenseDate"
            ).value;


        const selected =
            document.getElementById(
                "expenseCategory"
            ).value;


        const category =
            selected === "auto"
                ? autoCategory(name)
                : selected;


        data.expenses.push({

            id: crypto.randomUUID(),

            name,

            amount,

            category,

            date,

            ai: selected === "auto"

        });


        saveData();

        event.target.reset();

        expenseModal.classList.remove(
            "show"
        );

        render();

        showToast(
            `${category} transaction added`
        );

    }
);


/* =========================================================
   CSV IMPORT
========================================================= */

document.getElementById(
    "uploadCsvBtn"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "fileInput"
        ).click();

    }
);


document.getElementById(
    "uploadHeroBtn"
).addEventListener(
    "click",
    () => {

        navigate("documents");

        setTimeout(
            () => document
                .getElementById(
                    "fileInput"
                )
                .click(),
            200
        );

    }
);


function parseCSV(text) {

    const lines =
        text.trim()
            .split(/\r?\n/);


    if (lines.length < 2) {

        throw new Error(
            "CSV contains no transaction rows."
        );

    }


    const headers =
        lines[0]
            .split(",")
            .map(header =>
                header.trim()
                    .toLowerCase()
            );


    const dateIndex =
        headers.findIndex(
            h =>
                h.includes("date")
                ||
                h.includes("time")
        );


    const nameIndex =
        headers.findIndex(
            h =>
                h.includes("description")
                ||
                h.includes("merchant")
                ||
                h.includes("name")
                ||
                h.includes("narration")
        );


    const amountIndex =
        headers.findIndex(
            h =>
                h.includes("amount")
                ||
                h.includes("debit")
                ||
                h.includes("expense")
        );


    if (
        nameIndex === -1
        ||
        amountIndex === -1
    ) {

        throw new Error(
            "CSV needs Description/Merchant and Amount columns."
        );

    }


    const imported = [];


    for (
        let i = 1;
        i < lines.length;
        i++
    ) {

        if (!lines[i].trim()) continue;


        /*
            Simple CSV parser.
            Supports normal comma-separated
            transaction files.
        */

        const values =
            lines[i]
                .split(",")
                .map(value =>
                    value.trim()
                        .replace(/^"|"$/g,"")
                );


        const name =
            values[nameIndex];


        const rawAmount =
            values[amountIndex]
                ?.replace(/[₹,\s]/g,"");


        const amount =
            parseFloat(rawAmount);


        if (
            !name
            ||
            Number.isNaN(amount)
        ) continue;


        let date =
            dateIndex !== -1
                ? values[dateIndex]
                : new Date()
                    .toISOString()
                    .split("T")[0];


        const parsedDate =
            new Date(date);


        if (!Number.isNaN(parsedDate.getTime())) {

            date =
                parsedDate
                    .toISOString()
                    .split("T")[0];

        } else {

            date =
                new Date()
                    .toISOString()
                    .split("T")[0];

        }


        imported.push({

            id: crypto.randomUUID(),

            name,

            amount: Math.abs(amount),

            category: autoCategory(name),

            date,

            ai: true

        });

    }


    return imported;

}


document.getElementById(
    "fileInput"
).addEventListener(
    "change",
    async event => {

        const file =
            event.target.files[0];


        if (!file) return;


        await processUploadedFile(file);


        event.target.value = "";

    }
);


/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

const dropZone =
    document.getElementById(
        "dropZone"
    );


document.getElementById(
    "chooseFileBtn"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "fileInput"
        ).click();

    }
);


document.getElementById(
    "uploadDocumentBtn"
).addEventListener(
    "click",
    () => {

        document.getElementById(
            "fileInput"
        ).click();

    }
);


[
    "dragenter",
    "dragover"
].forEach(eventName => {

    dropZone.addEventListener(
        eventName,
        event => {

            event.preventDefault();

            dropZone.classList.add(
                "dragging"
            );

        }
    );

});


[
    "dragleave",
    "drop"
].forEach(eventName => {

    dropZone.addEventListener(
        eventName,
        event => {

            event.preventDefault();

            dropZone.classList.remove(
                "dragging"
            );

        }
    );

});


dropZone.addEventListener(
    "drop",
    async event => {

        const file =
            event.dataTransfer.files[0];

        if (file) {

            await processUploadedFile(file);

        }

    }
);


async function processUploadedFile(file) {

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    /* CSV */

    if (
        extension === "csv"
        ||
        extension === "txt"
    ) {

        try {

            const text =
                await file.text();


            const imported =
                parseCSV(text);


            if (!imported.length) {

                throw new Error(
                    "No valid transactions found."
                );

            }


            data.expenses.push(
                ...imported
            );


            saveData();

            render();

            showToast(
                `${imported.length} transactions imported`
            );


            navigate("transactions");


        } catch(error) {

            showToast(
                error.message
            );

        }

        return;

    }


    /* IMAGE / PDF / OTHER FILE */

    const reader =
        new FileReader();


    reader.onload = event => {

        data.documents.push({

            id: crypto.randomUUID(),

            name: file.name,

            type: file.type,

            size: file.size,

            data: event.target.result,

            date:
                new Date()
                    .toISOString()

        });


        saveData();

        renderDocuments();

        navigate("documents");

        showToast(
            "Document uploaded locally"
        );

    };


    reader.readAsDataURL(file);

}


/* =========================================================
   DOCUMENT RENDERING
========================================================= */

function renderDocuments() {

    const container =
        document.getElementById(
            "documentList"
        );


    if (!data.documents.length) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML =
        data.documents.map(doc => {

            const isImage =
                doc.type.startsWith(
                    "image/"
                );


            const preview =
                isImage

                ? `
                    <img
                        class="document-preview"
                        src="${doc.data}"
                        alt="${escapeHTML(doc.name)}"
                    >
                  `

                : `
                    <div class="document-preview"
                         style="
                            display:grid;
                            place-items:center;
                            font-size:40px;
                            color:var(--accent);
                         ">
                        ${
                            doc.type === "application/pdf"
                            ? "PDF"
                            : "FILE"
                        }
                    </div>
                  `;


            const size =
                formatFileSize(
                    doc.size
                );


            return `

                <div class="document-card">

                    ${preview}

                    <strong>
                        ${escapeHTML(doc.name)}
                    </strong>

                    <small>
                        ${size}
                        •
                        ${formatDate(
                            doc.date.split("T")[0]
                        )}
                    </small>

                    <button
                        class="danger-btn"
                        style="
                            margin-top:12px;
                            width:100%;
                        "
                        onclick="deleteDocument('${doc.id}')"
                    >
                        Remove
                    </button>

                </div>

            `;

        }).join("");

}


function deleteDocument(id) {

    data.documents =
        data.documents.filter(
            doc =>
                doc.id !== id
        );

    saveData();

    renderDocuments();

    showToast(
        "Document removed"
    );

}


function formatFileSize(bytes) {

    if (bytes < 1024)
        return `${bytes} B`;

    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(
        bytes / 1024 / 1024
    ).toFixed(1)} MB`;

}


/* =========================================================
   SETTINGS
========================================================= */

function loadSettings() {

    document.getElementById(
        "incomeInput"
    ).value = data.income;


    document.getElementById(
        "budgetInput"
    ).value = data.budget;


    document.getElementById(
        "savingsInput"
    ).value = data.savingsGoal;

}


document.getElementById(
    "saveSettings"
).addEventListener(
    "click",
    () => {

        data.income =
            Number(
                document.getElementById(
                    "incomeInput"
                ).value
            ) || 0;


        data.budget =
            Number(
                document.getElementById(
                    "budgetInput"
                ).value
            ) || 0;


        data.savingsGoal =
            Number(
                document.getElementById(
                    "savingsInput"
                ).value
            ) || 0;


        saveData();

        render();

        showToast(
            "Financial settings saved"
        );

    }
);


/* =========================================================
   RESET
========================================================= */

document.getElementById(
    "resetData"
).addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Reset all Finora demo data?"
            );


        if (!confirmed) return;


        localStorage.removeItem(
            STORAGE_KEY
        );


        location.reload();

    }
);


/* =========================================================
   SEARCH / SORT
========================================================= */

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    renderTransactionTable
);


document.getElementById(
    "categoryFilter"
).addEventListener(
    "change",
    renderTransactionTable
);


document.getElementById(
    "sortSelect"
).addEventListener(
    "change",
    renderTransactionTable
);


/* =========================================================
   ICONS
========================================================= */

function getCategoryIcon(category) {

    const icons = {

        Food: "🍔",

        Transport: "🚕",

        Shopping: "🛍",

        Entertainment: "🎬",

        Bills: "⚡",

        Health: "❤",

        Education: "📚",

        Other: "₹"

    };


    return icons[category]
        || "₹";

}


/* =========================================================
   MASTER RENDER
========================================================= */

function render() {

    renderDashboard();

    renderTransactionTable();

    renderDocuments();

    loadSettings();

}


render();