// --- Dashboard Logic ---
// Supplier Data
const suppliers = [
    {
        id: 1,
        name: "Acme Industrial",
        category: "Raw Materials",
        quality: 94,
        delivery: 96,
        overall: 95,
        status: "Approved"
    },
    {
        id: 2,
        name: "Globex Corporation",
        category: "Packaging",
        quality: 82,
        delivery: 78,
        overall: 80,
        status: "Warning"
    },
    {
        id: 3,
        name: "Soylent Corp",
        category: "Chemicals",
        quality: 98,
        delivery: 99,
        overall: 98,
        status: "Approved"
    },
    {
        id: 4,
        name: "Initech",
        category: "Hardware",
        quality: 65,
        delivery: 70,
        overall: 67,
        status: "Critical"
    },
    {
        id: 5,
        name: "Umbrella Corp",
        category: "Lab Equipment",
        quality: 91,
        delivery: 88,
        overall: 89,
        status: "Approved"
    }
];

// Utility functions
const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
        case 'approved': return 'status-approved';
        case 'warning': return 'status-warning';
        case 'critical': return 'status-critical';
        default: return '';
    }
};

const getColorByScore = (score) => {
    if (score >= 90) return 'var(--accent-green)';
    if (score >= 75) return 'var(--accent-orange)';
    return 'var(--accent-red)';
};

// Populate Table
const populateTable = () => {
    const tbody = document.getElementById('supplier-table-body');
    if (!tbody) return; // Only run on dashboard

    tbody.innerHTML = '';

    suppliers.forEach((supplier, index) => {
        const initials = supplier.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        // Add animation delay for staggered entrance
        const delay = index * 0.1;

        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.5s ease ${delay}s forwards`;
        row.style.opacity = '0';

        row.innerHTML = `
            <td>
                <div class="supplier-name">
                    <div class="supplier-logo">${initials}</div>
                    <span>${supplier.name}</span>
                </div>
            </td>
            <td>${supplier.category}</td>
            <td>
                ${supplier.quality}%
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${supplier.quality}%; background-color: ${getColorByScore(supplier.quality)}"></div>
                </div>
            </td>
            <td>
                ${supplier.delivery}%
                <div class="score-bar-container">
                    <div class="score-bar" style="width: ${supplier.delivery}%; background-color: ${getColorByScore(supplier.delivery)}"></div>
                </div>
            </td>
            <td><strong>${supplier.overall}%</strong></td>
            <td><span class="status-badge ${getStatusClass(supplier.status)}">${supplier.status}</span></td>
            <td>
                <button class="action-btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
};

// --- Suppliers Page Logic ---
const initSuppliersPage = () => {
    const openBtn = document.getElementById('open-add-supplier-modal');
    const modal = document.getElementById('add-supplier-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const cancelBtn = document.getElementById('cancel-modal-btn');
    const form = document.getElementById('add-supplier-form');

    if (!openBtn || !modal) return; // Only run on suppliers page

    const closeModal = () => {
        modal.classList.remove('active');
        form.reset();
    };

    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('supplier-name').value.trim();
        const category = document.getElementById('supplier-category').value;
        const quality = parseInt(document.getElementById('supplier-quality').value);
        const delivery = parseInt(document.getElementById('supplier-delivery').value);
        
        // Calculate overall score (average of quality and delivery)
        const overall = Math.round((quality + delivery) / 2);
        
        // Determine status based on overall
        let status = "Approved";
        if (overall < 85) status = "Warning";
        if (overall < 70) status = "Critical";

        // Add to array
        const newId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
        suppliers.push({
            id: newId,
            name: name,
            category: category,
            quality: quality,
            delivery: delivery,
            overall: overall,
            status: status
        });

        // Re-render table
        populateTable();
        closeModal();
    });
};

// --- Chemical Purity Database Logic ---
const initChemicalPurity = () => {
    const sendBtns = document.querySelectorAll('.send-to-calc');
    sendBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chemical = e.target.closest('button').dataset.chemical;
            localStorage.setItem('evalcore_selected_chemical', chemical);
            window.location.href = 'lab-reports.html';
        });
    });
};

// --- Lab Report Logic ---
const initLabReports = () => {
    const calcBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const addBtn = document.getElementById('add-chemical-btn');
    const container = document.getElementById('dynamic-inputs-container');
    const resultsSection = document.getElementById('results-section');
    const rawBody = document.getElementById('chemical-results-body');
    const summaryBody = document.getElementById('chemical-summary-body');

    if (!calcBtn) return; // Only run on lab reports page

    // Create a new input row
    const createInputRow = (chemicalName = '') => {
        const row = document.createElement('div');
        row.className = 'chemical-input-row';
        row.innerHTML = `
            <input type="text" class="chem-name" placeholder="Chemical Name (e.g. Sodium_Chloride)" value="${chemicalName}">
            <input type="number" step="0.01" class="chem-purity" placeholder="Purity %">
            <button class="icon-btn remove-btn"><i class="fa-solid fa-xmark"></i></button>
        `;
        
        row.querySelector('.remove-btn').addEventListener('click', () => {
            if (container.children.length > 1) {
                row.remove();
            } else {
                alert('You must have at least one input row.');
            }
        });
        
        return row;
    };

    // Auto-fill from LocalStorage if present
    const prefillChemical = localStorage.getItem('evalcore_selected_chemical');
    if (prefillChemical) {
        container.innerHTML = ''; // clear default rows
        container.appendChild(createInputRow(prefillChemical));
        localStorage.removeItem('evalcore_selected_chemical');
    } else {
        // Attach remove listeners to default rows
        const defaultRemoveBtns = container.querySelectorAll('.remove-btn');
        defaultRemoveBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (container.children.length > 1) {
                    e.target.closest('.chemical-input-row').remove();
                } else {
                    alert('You must have at least one input row.');
                }
            });
        });
    }

    addBtn.addEventListener('click', () => {
        container.appendChild(createInputRow());
    });

    calcBtn.addEventListener('click', () => {
        let count = 0;
        rawBody.innerHTML = '';
        summaryBody.innerHTML = '';
        const groups = {};

        const rows = container.querySelectorAll('.chemical-input-row');
        rows.forEach((row, index) => {
            const nameInput = row.querySelector('.chem-name').value.trim();
            const purityInput = parseFloat(row.querySelector('.chem-purity').value);
            
            if (nameInput && !isNaN(purityInput)) {
                count++;
                
                let status = "Approved";
                let statusClass = "status-approved";
                if (purityInput < 95) { status = "Warning"; statusClass = "status-warning"; }
                if (purityInput < 85) { status = "Critical"; statusClass = "status-critical"; }

                // Grouping
                if (!groups[nameInput]) {
                    groups[nameInput] = { totalPurity: 0, count: 0 };
                }
                groups[nameInput].totalPurity += purityInput;
                groups[nameInput].count += 1;

                // Add animation delay
                const delay = index * 0.05;
                const tr = document.createElement('tr');
                tr.style.animation = `fadeIn 0.3s ease ${delay}s forwards`;
                tr.style.opacity = '0';
                tr.innerHTML = `
                    <td><strong>${nameInput}</strong></td>
                    <td>
                        ${purityInput.toFixed(2)}%
                        <div class="score-bar-container">
                            <div class="score-bar" style="width: ${Math.min(purityInput, 100)}%; background-color: ${getColorByScore(purityInput)}"></div>
                        </div>
                    </td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                `;
                rawBody.appendChild(tr);
            }
        });

        if (count > 0) {
            let summaryIndex = 0;
            for (const [name, data] of Object.entries(groups)) {
                const avg = data.totalPurity / data.count;
                
                let status = "Approved";
                let statusClass = "status-approved";
                if (avg < 95) { status = "Warning"; statusClass = "status-warning"; }
                if (avg < 85) { status = "Critical"; statusClass = "status-critical"; }

                const delay = summaryIndex * 0.1;
                summaryIndex++;

                const tr = document.createElement('tr');
                tr.style.animation = `fadeIn 0.3s ease ${delay}s forwards`;
                tr.style.opacity = '0';
                tr.innerHTML = `
                    <td><strong>${name}</strong></td>
                    <td>${data.count}</td>
                    <td><strong>${avg.toFixed(2)}%</strong></td>
                    <td><span class="status-badge ${statusClass}">${status}</span></td>
                `;
                summaryBody.appendChild(tr);
            }
            
            resultsSection.style.display = 'grid';
            resultsSection.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            alert('No valid data found. Please ensure both Chemical Name and Purity are filled out.');
        }
    });

    clearBtn.addEventListener('click', () => {
        container.innerHTML = '';
        container.appendChild(createInputRow());
        container.appendChild(createInputRow());
        resultsSection.style.display = 'none';
    });
};

// Add basic keyframe animation to document
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// --- Mobile Sidebar Logic ---
const initMobileMenu = () => {
    const topbar = document.querySelector('.topbar');
    const sidebar = document.querySelector('.sidebar');
    if (topbar && sidebar) {
        // Create hamburger
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'icon-btn mobile-menu-btn';
        hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        topbar.insertBefore(hamburgerBtn, topbar.firstChild);

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        const toggleSidebar = () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        };

        hamburgerBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateTable();
    initChemicalPurity();
    initLabReports();
    initSuppliersPage();
    initMobileMenu();
});
