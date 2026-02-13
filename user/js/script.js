const API_CONFIG = {
    baseURL: 'http://localhost:52773/api/DictionaryManagement',
    pageSize: 10
};

const paginationState = {
    dictionary: {
        currentPage: 1,
        pageSize: API_CONFIG.pageSize,
        totalPages: 1,
        totalItems: 0,
        keyword: ''
    },
    content: {
        currentPage: 1,
        pageSize: API_CONFIG.pageSize,
        totalPages: 1,
        totalItems: 0,
        keyword: ''
    }
};

let appState = {
    dictionaries: [],
    allDictionaries: [],
    dictionaryContents: [],
    selectedDictionaryId: null,
    selectedDictionary: null,
    isLoading: false
};

let currentEditingContentId = null;
let itemToDelete = null;

const dom = {
    dictionaryTableBody: document.getElementById('dictionaryTableBody'),
    searchDictionaryInput: document.getElementById('searchDictionary'),
    addDictionaryBtn: document.getElementById('addDictionaryBtn'),
    dictionaryEmptyState: document.getElementById('dictionaryEmptyState'),
    contentTableBody: document.getElementById('contentTableBody'),
    searchContentInput: document.getElementById('searchContent'),
    addContentBtn: document.getElementById('addContentBtn'),
    selectedDictionaryName: document.getElementById('selectedDictionaryName'),
    contentEmptyState: document.getElementById('contentEmptyState'),
    dictionaryModal: document.getElementById('dictionaryModal'),
    contentModal: document.getElementById('contentModal'),
    deleteModal: document.getElementById('deleteModal'),
    dictionaryForm: document.getElementById('dictionaryForm'),
    contentForm: document.getElementById('contentForm'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    deleteMessage: document.getElementById('deleteMessage'),
    apiStatus: document.getElementById('apiStatus'),
    dictionaryPaginationInfo: document.getElementById('dictionaryPaginationInfo'),
    dictionaryCurrentPage: document.getElementById('dictionaryCurrentPage'),
    dictionaryTotalPages: document.getElementById('dictionaryTotalPages'),
    dictionaryTotalItems: document.getElementById('dictionaryTotalItems'),
    dictionaryPaginationControls: document.getElementById('dictionaryPaginationControls'),
    dictionaryFirstPage: document.getElementById('dictionaryFirstPage'),
    dictionaryPrevPage: document.getElementById('dictionaryPrevPage'),
    dictionaryPageInput: document.getElementById('dictionaryPageInput'),
    dictionaryGoToPage: document.getElementById('dictionaryGoToPage'),
    dictionaryNextPage: document.getElementById('dictionaryNextPage'),
    dictionaryLastPage: document.getElementById('dictionaryLastPage'),
    contentPaginationInfo: document.getElementById('contentPaginationInfo'),
    contentCurrentPage: document.getElementById('contentCurrentPage'),
    contentTotalPages: document.getElementById('contentTotalPages'),
    contentTotalItems: document.getElementById('contentTotalItems'),
    contentPaginationControls: document.getElementById('contentPaginationControls'),
    contentFirstPage: document.getElementById('contentFirstPage'),
    contentPrevPage: document.getElementById('contentPrevPage'),
    contentPageInput: document.getElementById('contentPageInput'),
    contentGoToPage: document.getElementById('contentGoToPage'),
    contentNextPage: document.getElementById('contentNextPage'),
    contentLastPage: document.getElementById('contentLastPage')
};

const API = {
    async getDictionaries(params = {}) {
        const body = {
            keyword: params.keyword || '',
            page: params.page || 1,
            pageSize: params.pageSize || API_CONFIG.pageSize,
            sortField: params.sortField || 'createdAt',
            sortOrder: params.sortOrder || 'desc'
        };
        
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionaries/list`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error('Get dictionaries failed:', error);
            throw error;
        }
    },
    
    async getAllDictionaries() {
        const body = {
            keyword: '',
            page: 1,
            pageSize: 1000,
            sortField: 'createdAt',
            sortOrder: 'desc'
        };
        
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionaries/list`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error('Get all dictionaries failed:', error);
            throw error;
        }
    },
    
    async getDictionary(id) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionaries/detail`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Get dictionary failed (ID: ${id}):`, error);
            throw error;
        }
    },
    
    async createDictionary(data) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionaries/create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error('Create dictionary failed:', error);
            throw error;
        }
    },
    
    async updateDictionary(id, data) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionaries/update`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, ...data})
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Update dictionary failed (ID: ${id}):`, error);
            throw error;
        }
    },
    
    async deleteDictionary(id) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionaries/delete`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Delete dictionary failed (ID: ${id}):`, error);
            throw error;
        }
    },
    
    async getDictionaryContents(params) {
        const body = {
            dictId: params.dictId,
            keyword: params.keyword || '',
            page: params.page || 1,
            pageSize: params.pageSize || API_CONFIG.pageSize,
            sortField: params.sortField || 'sort',
            sortOrder: params.sortOrder || 'asc'
        };
        
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionary-contents/list`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error('Get dictionary contents failed:', error);
            throw error;
        }
    },
    
    async getDictionaryContent(id) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionary-contents/detail`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Get dictionary content failed (ID: ${id}):`, error);
            throw error;
        }
    },
    
    async createDictionaryContent(data) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionary-contents/create`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error('Create dictionary content failed:', error);
            throw error;
        }
    },
    
    async updateDictionaryContent(id, data) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionary-contents/update`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id, ...data})
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Update dictionary content failed (ID: ${id}):`, error);
            throw error;
        }
    },
    
    async deleteDictionaryContent(id) {
        try {
            const res = await fetch(`${API_CONFIG.baseURL}/dictionary-contents/delete`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            return await res.json();
        } catch (error) {
            console.error(`Delete dictionary content failed (ID: ${id}):`, error);
            throw error;
        }
    }
};

function showLoading(container, msg = 'Loading...') {
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>${msg}</p>
        </div>
    `;
}

function showError(container, msg) {
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>${msg}</span>
        </div>
    `;
}

function updateApiStatus(status, msg = '') {
    const el = dom.apiStatus.querySelector('.status-indicator');
    
    switch (status) {
        case 'checking':
            el.textContent = 'Checking...';
            el.className = 'status-indicator';
            break;
        case 'online':
            el.textContent = 'Online';
            el.className = 'status-indicator online';
            break;
        case 'error':
            el.textContent = `Error: ${msg}`;
            el.className = 'status-indicator error';
            break;
        default:
            el.textContent = 'Unknown';
            el.className = 'status-indicator';
    }
}

function updatePaginationInfo(type) {
    const state = paginationState[type];
    const prefix = type === 'dictionary' ? 'dictionary' : 'content';
    
    if (dom[`${prefix}CurrentPage`]) {
        dom[`${prefix}CurrentPage`].textContent = state.currentPage;
        dom[`${prefix}TotalPages`].textContent = state.totalPages;
        dom[`${prefix}TotalItems`].textContent = state.totalItems;
        dom[`${prefix}PageInput`].value = state.currentPage;
    }
    
    if (type === 'dictionary') {
        dom.dictionaryFirstPage.disabled = state.currentPage <= 1;
        dom.dictionaryPrevPage.disabled = state.currentPage <= 1;
        dom.dictionaryNextPage.disabled = state.currentPage >= state.totalPages;
        dom.dictionaryLastPage.disabled = state.currentPage >= state.totalPages;
    } else {
        dom.contentFirstPage.disabled = state.currentPage <= 1;
        dom.contentPrevPage.disabled = state.currentPage <= 1;
        dom.contentNextPage.disabled = state.currentPage >= state.totalPages;
        dom.contentLastPage.disabled = state.currentPage >= state.totalPages;
    }
    
    const showPagination = state.totalItems > state.pageSize;
    if (dom[`${prefix}PaginationControls`]) {
        dom[`${prefix}PaginationControls`].style.display = showPagination ? 'flex' : 'none';
    }
    if (dom[`${prefix}PaginationInfo`]) {
        dom[`${prefix}PaginationInfo`].style.display = state.totalItems > 0 ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
    updatePaginationInfo('dictionary');
    updatePaginationInfo('content');
});

async function initApp() {
    try {
        updateApiStatus('checking');
        appState.isLoading = true;
        showLoading(dom.dictionaryTableBody, 'Connecting...');
        
        paginationState.dictionary.currentPage = 1;
        paginationState.dictionary.keyword = '';
        
        const res = await API.getDictionaries({
            page: paginationState.dictionary.currentPage,
            pageSize: paginationState.dictionary.pageSize
        });
        
        if (res.code === 200) {
            updateApiStatus('online');
            appState.dictionaries = res.data.list;
            
            const allRes = await API.getAllDictionaries();
            if (allRes.code === 200) {
                appState.allDictionaries = allRes.data.list;
            }
            
            if (res.data.pagination) {
                const p = res.data.pagination;
                paginationState.dictionary.totalItems = p.total;
                paginationState.dictionary.totalPages = p.totalPages;
                paginationState.dictionary.currentPage = p.page;
                paginationState.dictionary.pageSize = p.pageSize;
            }
            
            renderDictionaryList();
            updatePaginationInfo('dictionary');
            
            if (appState.dictionaries.length > 0) {
                await selectDictionary(appState.dictionaries[0].id);
            } else {
                renderNoDictionarySelected();
            }
        } else {
            updateApiStatus('error', res.message);
            showError(dom.dictionaryTableBody, `Load failed: ${res.message}`);
        }
    } catch (error) {
        console.error('Init app failed:', error);
        updateApiStatus('error', error.message);
        showError(dom.dictionaryTableBody, `Network error: ${error.message}`);
    } finally {
        appState.isLoading = false;
    }
}

function setupEventListeners() {
    dom.searchDictionaryInput.addEventListener('input', debounce(async () => {
        paginationState.dictionary.keyword = dom.searchDictionaryInput.value.trim();
        paginationState.dictionary.currentPage = 1;
        await loadDictionaries();
    }, 500));
    
    dom.searchContentInput.addEventListener('input', debounce(async () => {
        if (appState.selectedDictionaryId) {
            paginationState.content.keyword = dom.searchContentInput.value.trim();
            paginationState.content.currentPage = 1;
            await loadDictionaryContents();
        }
    }, 500));
    
    dom.dictionaryFirstPage.addEventListener('click', () => goToPage('dictionary', 1));
    dom.dictionaryPrevPage.addEventListener('click', () => goToPage('dictionary', paginationState.dictionary.currentPage - 1));
    dom.dictionaryNextPage.addEventListener('click', () => goToPage('dictionary', paginationState.dictionary.currentPage + 1));
    dom.dictionaryLastPage.addEventListener('click', () => goToPage('dictionary', paginationState.dictionary.totalPages));
    dom.dictionaryGoToPage.addEventListener('click', () => {
        const page = parseInt(dom.dictionaryPageInput.value);
        if (page >= 1 && page <= paginationState.dictionary.totalPages) {
            goToPage('dictionary', page);
        } else {
            showNotification('Please enter a valid page number', 'error');
        }
    });
    
    dom.contentFirstPage.addEventListener('click', () => goToPage('content', 1));
    dom.contentPrevPage.addEventListener('click', () => goToPage('content', paginationState.content.currentPage - 1));
    dom.contentNextPage.addEventListener('click', () => goToPage('content', paginationState.content.currentPage + 1));
    dom.contentLastPage.addEventListener('click', () => goToPage('content', paginationState.content.totalPages));
    dom.contentGoToPage.addEventListener('click', () => {
        const page = parseInt(dom.contentPageInput.value);
        if (page >= 1 && page <= paginationState.content.totalPages) {
            goToPage('content', page);
        } else {
            showNotification('Please enter a valid page number', 'error');
        }
    });
    
    dom.addDictionaryBtn.addEventListener('click', () => openDictionaryModal());
    dom.addContentBtn.addEventListener('click', () => openContentModal());
    
    document.querySelectorAll('.close, .close-modal').forEach(btn => {
        btn.addEventListener('click', () => closeAllModals());
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === dom.dictionaryModal || e.target === dom.contentModal || e.target === dom.deleteModal) {
            closeAllModals();
        }
    });
    
    dom.dictionaryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveDictionary();
    });
    
    dom.contentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveDictionaryContent();
    });
    
    dom.confirmDeleteBtn.addEventListener('click', async () => {
        await deleteItem();
    });
}

function debounce(func, wait) {
    let timeout;
    return (...args) => {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function goToPage(type, page) {
    if (type === 'dictionary') {
        paginationState.dictionary.currentPage = page;
        await loadDictionaries();
    } else if (type === 'content' && appState.selectedDictionaryId) {
        paginationState.content.currentPage = page;
        await loadDictionaryContents();
    }
}

async function loadDictionaries() {
    try {
        appState.isLoading = true;
        showLoading(dom.dictionaryTableBody, 'Loading...');
        
        const res = await API.getDictionaries({
            keyword: paginationState.dictionary.keyword,
            page: paginationState.dictionary.currentPage,
            pageSize: paginationState.dictionary.pageSize
        });
        
        if (res.code === 200) {
            appState.dictionaries = res.data.list;
            
            if (res.data.pagination) {
                const p = res.data.pagination;
                paginationState.dictionary.totalItems = p.total;
                paginationState.dictionary.totalPages = p.totalPages;
                paginationState.dictionary.currentPage = p.page;
                paginationState.dictionary.pageSize = p.pageSize;
            }
            
            renderDictionaryList();
            updatePaginationInfo('dictionary');
        } else {
            showError(dom.dictionaryTableBody, `Load failed: ${res.message}`);
        }
    } catch (error) {
        console.error('Load dictionaries failed:', error);
        updateApiStatus('error', error.message);
        showError(dom.dictionaryTableBody, `Network error: ${error.message}`);
    } finally {
        appState.isLoading = false;
    }
}

function renderDictionaryList() {
    const tbody = dom.dictionaryTableBody;
    
    if (appState.dictionaries.length === 0) {
        dom.dictionaryEmptyState.style.display = 'flex';
        tbody.innerHTML = '<tr><td colspan="3" class="no-data"><i class="fas fa-book-open"></i><p>No dictionaries found</p></td></tr>';
        return;
    }
    
    dom.dictionaryEmptyState.style.display = 'none';
    tbody.innerHTML = '';
    
    appState.dictionaries.forEach(dict => {
        const row = document.createElement('tr');
        if (dict.id === appState.selectedDictionaryId) {
            row.classList.add('selected');
        }
        
        row.innerHTML = `
            <td>${dict.name}</td>
            <td>${dict.remark || 'None'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit edit-dict" data-id="${dict.id}" data-name="${dict.name}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete delete-dict" data-id="${dict.id}" data-name="${dict.name}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    bindDictionaryButtonEvents();
}

function bindDictionaryButtonEvents() {
    document.querySelectorAll('.edit-dict').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.getAttribute('data-id'));
            await openDictionaryModal(id);
        });
    });
    
    document.querySelectorAll('.delete-dict').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            const name = btn.getAttribute('data-name');
            showDeleteConfirmation('dictionary', id, name);
        });
    });
    
    document.querySelectorAll('#dictionaryTableBody tr').forEach(row => {
        row.addEventListener('click', (e) => {
            if (!e.target.closest('.actions')) {
                const id = parseInt(row.querySelector('.edit-dict').getAttribute('data-id'));
                selectDictionary(id);
            }
        });
    });
}

async function selectDictionary(id) {
    try {
        appState.selectedDictionaryId = id;
        
        const res = await API.getDictionary(id);
        if (res.code === 200) {
            appState.selectedDictionary = res.data;
            dom.selectedDictionaryName.textContent = appState.selectedDictionary.name;
            
            dom.searchContentInput.disabled = false;
            dom.addContentBtn.disabled = false;
            
            paginationState.content.currentPage = 1;
            paginationState.content.keyword = '';
            dom.searchContentInput.value = '';
            
            renderDictionaryList();
            await loadDictionaryContents();
        } else {
            showNotification(`Failed to get dictionary: ${res.message}`, 'error');
        }
    } catch (error) {
        console.error('Select dictionary failed:', error);
        showNotification(`Failed to select dictionary: ${error.message}`, 'error');
    }
}

async function loadDictionaryContents() {
    if (!appState.selectedDictionaryId) return;
    
    try {
        showLoading(dom.contentTableBody, 'Loading...');
        
        const res = await API.getDictionaryContents({
            dictId: appState.selectedDictionaryId,
            keyword: paginationState.content.keyword,
            page: paginationState.content.currentPage,
            pageSize: paginationState.content.pageSize
        });
        
        if (res.code === 200) {
            appState.dictionaryContents = res.data.list;
            
            if (res.data.pagination) {
                const p = res.data.pagination;
                paginationState.content.totalItems = p.total;
                paginationState.content.totalPages = p.totalPages;
                paginationState.content.currentPage = p.page;
                paginationState.content.pageSize = p.pageSize;
            }
            
            renderDictionaryContents();
            updatePaginationInfo('content');
        } else {
            showError(dom.contentTableBody, `Load failed: ${res.message}`);
        }
    } catch (error) {
        console.error('Load dictionary contents failed:', error);
        showError(dom.contentTableBody, `Network error: ${error.message}`);
    }
}

function renderDictionaryContents() {
    const tbody = dom.contentTableBody;
    
    if (appState.dictionaryContents.length === 0) {
        dom.contentEmptyState.style.display = 'flex';
        const searchTerm = paginationState.content.keyword;
        dom.contentEmptyState.innerHTML = `
            <i class="fas fa-clipboard-list"></i>
            <p>${searchTerm ? 'No matching content found' : 'No content in this dictionary'}</p>
        `;
        tbody.innerHTML = '<tr><td colspan="3" class="no-data"><i class="fas fa-clipboard-list"></i><p>No data</p></td></tr>';
        return;
    }
    
    dom.contentEmptyState.style.display = 'none';
    tbody.innerHTML = '';
    
    appState.dictionaryContents.forEach(content => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${content.code}</td>
            <td>${content.value}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-edit edit-content" data-id="${content.id}" data-value="${content.value}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-delete delete-content" data-id="${content.id}" data-value="${content.value}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    bindContentButtonEvents();
}

function bindContentButtonEvents() {
    document.querySelectorAll('.edit-content').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            await openContentModal(id);
        });
    });
    
    document.querySelectorAll('.delete-content').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const value = btn.getAttribute('data-value');
            showDeleteConfirmation('content', id, value);
        });
    });
}

function renderNoDictionarySelected() {
    dom.selectedDictionaryName.textContent = 'No dictionary selected';
    dom.searchContentInput.disabled = true;
    dom.addContentBtn.disabled = true;
    dom.contentEmptyState.style.display = 'flex';
    dom.contentTableBody.innerHTML = '<tr><td colspan="3" class="no-data"><i class="fas fa-clipboard-list"></i><p>Select a dictionary to view content</p></td></tr>';
    
    paginationState.content.currentPage = 1;
    paginationState.content.totalItems = 0;
    paginationState.content.totalPages = 1;
    updatePaginationInfo('content');
}

async function openDictionaryModal(id = null) {
    const modalTitle = document.getElementById('dictionaryModalTitle');
    const nameInput = document.getElementById('dictName');
    const remarkInput = document.getElementById('dictRemark');
    
    if (id) {
        try {
            const res = await API.getDictionary(id);
            if (res.code === 200) {
                const dict = res.data;
                modalTitle.textContent = 'Edit Dictionary';
                nameInput.value = dict.name;
                remarkInput.value = dict.remark || '';
                dom.dictionaryForm.setAttribute('data-id', id);
            } else {
                showNotification(`Failed to get dictionary: ${res.message}`, 'error');
                return;
            }
        } catch (error) {
            showNotification(`Failed to get dictionary: ${error.message}`, 'error');
            return;
        }
    } else {
        modalTitle.textContent = 'Add Dictionary';
        nameInput.value = '';
        remarkInput.value = '';
        dom.dictionaryForm.removeAttribute('data-id');
    }
    
    dom.dictionaryModal.style.display = 'flex';
    nameInput.focus();
}

async function openContentModal(id = null) {
    if (!appState.selectedDictionaryId) {
        showNotification('Please select a dictionary first', 'error');
        return;
    }
    
    const modalTitle = document.getElementById('contentModalTitle');
    const codeInput = document.getElementById('contentCode');
    const valueInput = document.getElementById('contentValue');
    
    codeInput.value = '';
    valueInput.value = '';
    
    if (id) {
        currentEditingContentId = id;
        modalTitle.textContent = 'Edit Content';
        
        try {
            const res = await API.getDictionaryContent(id);
            if (res.code === 200) {
                const content = res.data;
                codeInput.value = content.code;
                valueInput.value = content.value;
            } else {
                showNotification(`Failed to get content: ${res.message}`, 'error');
                return;
            }
        } catch (error) {
            showNotification(`Failed to get content: ${error.message}`, 'error');
            return;
        }
    } else {
        currentEditingContentId = null;
        modalTitle.textContent = 'Add Content';
    }
    
    dom.contentModal.style.display = 'flex';
    codeInput.focus();
}

async function saveDictionary() {
    const nameInput = document.getElementById('dictName');
    const remarkInput = document.getElementById('dictRemark');
    
    const name = nameInput.value.trim();
    const remark = remarkInput.value.trim();
    
    if (!name) {
        showNotification('Dictionary name is required', 'error');
        return;
    }
    
    const idAttr = dom.dictionaryForm.getAttribute('data-id');
    const isEdit = !!idAttr;
    
    try {
        let res;
        
        if (isEdit) {
            const id = idAttr;
            res = await API.updateDictionary(id, { name, remark });
        } else {
            res = await API.createDictionary({ name, remark });
        }
        
        if (res.code === 200 || res.code === 201) {
            paginationState.dictionary.currentPage = 1;
            await loadDictionaries();
            
            const allRes = await API.getAllDictionaries();
            if (allRes.code === 200) {
                appState.allDictionaries = allRes.data.list;
            }
            
            if (!isEdit && res.data) {
                await selectDictionary(res.data.id);
            }
            
            closeAllModals();
            showNotification(isEdit ? 'Dictionary updated' : 'Dictionary added', 'success');
        } else {
            showNotification(`Operation failed: ${res.message}`, 'error');
        }
    } catch (error) {
        console.error('Save dictionary failed:', error);
        showNotification(`Save failed: ${error.message}`, 'error');
    }
}

async function saveDictionaryContent() {
    if (!appState.selectedDictionaryId) {
        showNotification('Please select a dictionary first', 'error');
        return;
    }
    
    const codeInput = document.getElementById('contentCode');
    const valueInput = document.getElementById('contentValue');
    
    const code = codeInput.value.trim();
    const value = valueInput.value.trim();
    
    if (!code || !value) {
        showNotification('Code and value are required', 'error');
        return;
    }
    
    try {
        let res;
        const data = {
            dictId: appState.selectedDictionaryId,
            code,
            value
        };
        
        if (currentEditingContentId) {
            res = await API.updateDictionaryContent(currentEditingContentId, data);
        } else {
            res = await API.createDictionaryContent(data);
        }
        
        if (res.code === 200 || res.code === 201) {
            paginationState.content.currentPage = 1;
            await loadDictionaryContents();
            
            closeAllModals();
            showNotification(currentEditingContentId ? 'Content updated' : 'Content added', 'success');
            
            currentEditingContentId = null;
        } else {
            showNotification(`Operation failed: ${res.message}`, 'error');
        }
    } catch (error) {
        console.error('Save content failed:', error);
        showNotification(`Save failed: ${error.message}`, 'error');
    }
}

async function showDeleteConfirmation(type, id, itemName) {
    if (type === 'dictionary') {
        const dict = appState.allDictionaries.find(d => d.id === id);
        if (!dict) {
            const currentDict = appState.dictionaries.find(d => d.id === id);
            if (currentDict) {
                itemName = currentDict.name;
            } else if (!itemName) {
                itemName = 'this dictionary';
            }
        } else {
            itemName = dict.name;
        }
        
        dom.deleteMessage.textContent = `Delete dictionary "${itemName}"? This will also delete all its content.`;
    } else {
        if (!itemName) {
            itemName = 'this content';
        }
        dom.deleteMessage.textContent = `Delete content "${itemName}"?`;
    }
    
    itemToDelete = { type, id, itemName };
    dom.deleteModal.style.display = 'flex';
}

async function deleteItem() {
    if (!itemToDelete) return;
    
    const { type, id } = itemToDelete;
    
    try {
        let res;
        
        if (type === 'dictionary') {
            res = await API.deleteDictionary(id);
            
            if (res.code === 200) {
                if (appState.selectedDictionaryId === id) {
                    renderNoDictionarySelected();
                    appState.selectedDictionaryId = null;
                    appState.selectedDictionary = null;
                }
                
                paginationState.dictionary.currentPage = 1;
                await loadDictionaries();
                
                const allRes = await API.getAllDictionaries();
                if (allRes.code === 200) {
                    appState.allDictionaries = allRes.data.list;
                }
                
                showNotification('Dictionary deleted', 'success');
            } else {
                showNotification(`Delete failed: ${res.message}`, 'error');
            }
        } else {
            res = await API.deleteDictionaryContent(id);
            
            if (res.code === 200) {
                await loadDictionaryContents();
                showNotification('Content deleted', 'success');
            } else {
                showNotification(`Delete failed: ${res.message}`, 'error');
            }
        }
    } catch (error) {
        console.error('Delete failed:', error);
        showNotification(`Delete failed: ${error.message}`, 'error');
    }
    
    closeAllModals();
    itemToDelete = null;
}

function closeAllModals() {
    dom.dictionaryModal.style.display = 'none';
    dom.contentModal.style.display = 'none';
    dom.deleteModal.style.display = 'none';
    
    dom.dictionaryForm.reset();
    dom.contentForm.reset();
    
    dom.dictionaryForm.removeAttribute('data-id');
    
    currentEditingContentId = null;
}

function showNotification(msg, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = msg;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s, fadeOut 0.3s 2.7s;
        animation-fill-mode: forwards;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    `;
    
    notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
    
    document.body.appendChild(notification);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        if (notification.parentNode) notification.parentNode.removeChild(notification);
        if (style.parentNode) style.parentNode.removeChild(style);
    }, 3000);
}

// 在现有的JavaScript文件中添加以下代码

// 更新状态指示器函数
function updateApiStatus(status, msg = '') {
    const el = document.getElementById('apiStatus');
    const dot = el.querySelector('.status-dot');
    const text = el.querySelector('.status-text');
    
    el.className = 'status-indicator';
    
    switch (status) {
        case 'checking':
            text.textContent = 'Connecting...';
            dot.style.background = '#f39c12';
            break;
        case 'online':
            text.textContent = 'Online';
            el.classList.add('online');
            dot.style.background = '#2ecc71';
            break;
        case 'error':
            text.textContent = msg ? `Error: ${msg}` : 'Connection Failed';
            el.classList.add('error');
            dot.style.background = '#e74c3c';
            break;
    }
}

// 更新字典数量显示
function updateDictionaryCount() {
    const countElement = document.getElementById('dictCount');
    if (countElement) {
        countElement.textContent = paginationState.dictionary.totalItems || '0';
    }
}

// 更新内容数量显示
function updateContentCount() {
    const countElement = document.getElementById('contentCount');
    if (countElement && appState.selectedDictionaryId) {
        countElement.textContent = paginationState.content.totalItems || '0';
    } else if (countElement) {
        countElement.textContent = '0';
    }
}

// 在适当的时机调用更新函数
// 在 loadDictionaries 函数成功后调用 updateDictionaryCount()
// 在 loadDictionaryContents 函数成功后调用 updateContentCount()
