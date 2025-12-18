// ==================== 矩阵计算器 - 全新架构 ====================

// 全局状态
let currentMode = 'single';
let singleMatrixData = { rows: 3, cols: 3, data: [] };
let matrixAData = { rows: 3, cols: 3, data: [] };
let matrixBData = { rows: 3, cols: 3, data: [] };
let lastResult = null;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initSingleMatrix(3, 3);
    initMatrix('A', 3, 3);
    initMatrix('B', 3, 3);
});

// ==================== 模式切换 ====================
function switchMode(mode) {
    currentMode = mode;
    
    document.getElementById('singleModeBtn').classList.toggle('active', mode === 'single');
    document.getElementById('multiModeBtn').classList.toggle('active', mode === 'multi');
    
    document.getElementById('singleMode').classList.toggle('active', mode === 'single');
    document.getElementById('multiMode').classList.toggle('active', mode === 'multi');
}

// ==================== 单矩阵模式 ====================
function initSingleMatrix(rows, cols) {
    const container = document.getElementById('singleMatrix');
    singleMatrixData.rows = rows;
    singleMatrixData.cols = cols;
    
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    let html = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const val = singleMatrixData.data[i]?.[j] ?? '';
            html += `<input type="text" id="single_${i}_${j}" value="${val}" 
                     placeholder="0" onkeydown="handleKeyNav(event, 'single', ${i}, ${j}, ${rows}, ${cols})">`;
        }
    }
    container.innerHTML = html;
    
    // 初始化数据数组
    if (!singleMatrixData.data.length) {
        singleMatrixData.data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    }
}

function resizeSingleMatrix() {
    const rows = parseInt(document.getElementById('singleRows').value);
    const cols = parseInt(document.getElementById('singleCols').value);
    
    // 保留旧数据
    const oldData = singleMatrixData.data;
    singleMatrixData.data = [];
    
    for (let i = 0; i < rows; i++) {
        singleMatrixData.data[i] = [];
        for (let j = 0; j < cols; j++) {
            singleMatrixData.data[i][j] = oldData[i]?.[j] ?? 0;
        }
    }
    
    initSingleMatrix(rows, cols);
}

function clearSingleMatrix() {
    const { rows, cols } = singleMatrixData;
    singleMatrixData.data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`single_${i}_${j}`).value = '';
        }
    }
}

function fillRandomSingle() {
    const { rows, cols } = singleMatrixData;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const val = Math.floor(Math.random() * 19) - 9;
            singleMatrixData.data[i][j] = val;
            document.getElementById(`single_${i}_${j}`).value = val;
        }
    }
}

function fillIdentitySingle() {
    const { rows, cols } = singleMatrixData;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const val = i === j ? 1 : 0;
            singleMatrixData.data[i][j] = val;
            document.getElementById(`single_${i}_${j}`).value = val || '';
        }
    }
}

function getSingleMatrixData() {
    const { rows, cols } = singleMatrixData;
    const data = [];
    
    for (let i = 0; i < rows; i++) {
        data[i] = [];
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`single_${i}_${j}`);
            const value = parseValue(input.value);
            if (isNaN(value)) {
                showError(`第${i+1}行第${j+1}列的值无效`);
                return null;
            }
            data[i][j] = value;
        }
    }
    
    return data;
}

// ==================== 多矩阵模式 ====================
function initMatrix(name, rows, cols) {
    const container = document.getElementById('matrix' + name);
    const matrix = name === 'A' ? matrixAData : matrixBData;
    matrix.rows = rows;
    matrix.cols = cols;
    
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    let html = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const val = matrix.data[i]?.[j] ?? '';
            html += `<input type="text" id="${name}_${i}_${j}" value="${val}" 
                     placeholder="0" onkeydown="handleKeyNav(event, '${name}', ${i}, ${j}, ${rows}, ${cols})">`;
        }
    }
    container.innerHTML = html;
    
    if (!matrix.data.length) {
        matrix.data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    }
}

function resizeMatrix(name) {
    const rows = parseInt(document.getElementById('rows' + name).value);
    const cols = parseInt(document.getElementById('cols' + name).value);
    
    const matrix = name === 'A' ? matrixAData : matrixBData;
    const oldData = matrix.data;
    matrix.data = [];
    
    for (let i = 0; i < rows; i++) {
        matrix.data[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix.data[i][j] = oldData[i]?.[j] ?? 0;
        }
    }
    
    initMatrix(name, rows, cols);
}

function clearMatrix(name) {
    const matrix = name === 'A' ? matrixAData : matrixBData;
    const { rows, cols } = matrix;
    matrix.data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(`${name}_${i}_${j}`).value = '';
        }
    }
}

function fillRandom(name) {
    const matrix = name === 'A' ? matrixAData : matrixBData;
    const { rows, cols } = matrix;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const val = Math.floor(Math.random() * 19) - 9;
            matrix.data[i][j] = val;
            document.getElementById(`${name}_${i}_${j}`).value = val;
        }
    }
}

function getMatrixData(name) {
    const matrix = name === 'A' ? matrixAData : matrixBData;
    const { rows, cols } = matrix;
    const data = [];
    
    for (let i = 0; i < rows; i++) {
        data[i] = [];
        for (let j = 0; j < cols; j++) {
            const input = document.getElementById(`${name}_${i}_${j}`);
            const value = parseValue(input.value);
            if (isNaN(value)) {
                showError(`矩阵${name}第${i+1}行第${j+1}列的值无效`);
                return null;
            }
            data[i][j] = value;
        }
    }
    
    return data;
}

// ==================== 键盘导航 ====================
function handleKeyNav(event, prefix, row, col, maxRows, maxCols) {
    let newRow = row, newCol = col;
    
    switch(event.key) {
        case 'ArrowUp': newRow = Math.max(0, row - 1); break;
        case 'ArrowDown': newRow = Math.min(maxRows - 1, row + 1); break;
        case 'ArrowLeft': 
            if (event.target.selectionStart === 0) newCol = Math.max(0, col - 1); 
            else return; 
            break;
        case 'ArrowRight': 
            if (event.target.selectionStart === event.target.value.length) newCol = Math.min(maxCols - 1, col + 1); 
            else return; 
            break;
        case 'Enter':
        case 'Tab':
            event.preventDefault();
            newCol = col + 1;
            if (newCol >= maxCols) {
                newCol = 0;
                newRow = row + 1;
                if (newRow >= maxRows) newRow = 0;
            }
            break;
        default: return;
    }
    
    if (newRow !== row || newCol !== col) {
        event.preventDefault();
        document.getElementById(`${prefix}_${newRow}_${newCol}`).focus();
    }
}

// ==================== 值解析 ====================
function parseValue(str) {
    if (!str || str.trim() === '') return 0;
    str = str.trim();
    
    // 处理分数
    if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) {
                return num / den;
            }
        }
    }
    
    try {
        const result = Function('"use strict"; return (' + str + ')')();
        return typeof result === 'number' ? result : NaN;
    } catch (e) {
        return parseFloat(str);
    }
}

// ==================== 单矩阵运算 ====================
function calcSingle(op) {
    const data = getSingleMatrixData();
    if (!data) return;
    
    const { rows, cols } = singleMatrixData;
    
    switch(op) {
        case 'det':
            if (rows !== cols) { showError('行列式只能计算方阵'); return; }
            showScalarResult('行列式 |A|', determinant(data));
            break;
        case 'inv':
            if (rows !== cols) { showError('只有方阵才有逆矩阵'); return; }
            const det = determinant(data);
            if (Math.abs(det) < 1e-10) { showError('矩阵奇异，不存在逆矩阵'); return; }
            showMatrixResult('逆矩阵 A⁻¹', inverse(data));
            break;
        case 'trans':
            showMatrixResult('转置矩阵 Aᵀ', transpose(data));
            break;
        case 'rank':
            showScalarResult('矩阵的秩', matrixRank(data));
            break;
        case 'trace':
            if (rows !== cols) { showError('迹只能计算方阵'); return; }
            let trace = 0;
            for (let i = 0; i < rows; i++) trace += data[i][i];
            showScalarResult('矩阵的迹 tr(A)', trace);
            break;
        case 'eigen':
            if (rows !== cols) { showError('特征值只能计算方阵'); return; }
            calcEigenvalues(data);
            break;
        case 'rref':
            showMatrixResult('简化行阶梯形 (RREF)', toReducedRowEchelon(data));
            break;
        case 'power':
            if (rows !== cols) { showError('幂运算只能计算方阵'); return; }
            const power = parseInt(prompt('请输入幂次（非负整数）:', '2'));
            if (isNaN(power) || power < 0) { showError('请输入有效的非负整数'); return; }
            showMatrixResult(`A^${power}`, matrixPower(data, power));
            break;
        case 'scalar':
            const scalar = parseFloat(document.getElementById('singleScalar').value);
            if (isNaN(scalar)) { showError('请输入有效的标量值'); return; }
            const scaledResult = data.map(row => row.map(v => v * scalar));
            showMatrixResult(`${scalar} × A`, scaledResult);
            break;
    }
}

// ==================== 多矩阵运算 ====================
function calcMatrix(name, op) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const matrix = name === 'A' ? matrixAData : matrixBData;
    const { rows, cols } = matrix;
    
    switch(op) {
        case 'det':
            if (rows !== cols) { showError('行列式只能计算方阵'); return; }
            showScalarResult(`|${name}|`, determinant(data));
            break;
        case 'inv':
            if (rows !== cols) { showError('只有方阵才有逆矩阵'); return; }
            const det = determinant(data);
            if (Math.abs(det) < 1e-10) { showError('矩阵奇异，不存在逆矩阵'); return; }
            showMatrixResult(`${name}⁻¹`, inverse(data));
            break;
        case 'trans':
            showMatrixResult(`${name}ᵀ`, transpose(data));
            break;
        case 'rank':
            showScalarResult(`rank(${name})`, matrixRank(data));
            break;
    }
}

function binaryOp(op) {
    const dataA = getMatrixData('A');
    const dataB = getMatrixData('B');
    if (!dataA || !dataB) return;
    
    switch(op) {
        case 'add':
            if (matrixAData.rows !== matrixBData.rows || matrixAData.cols !== matrixBData.cols) {
                showError('矩阵加法要求两矩阵大小相同');
                return;
            }
            showMatrixResult('A + B', dataA.map((row, i) => row.map((v, j) => v + dataB[i][j])));
            break;
        case 'sub':
            if (matrixAData.rows !== matrixBData.rows || matrixAData.cols !== matrixBData.cols) {
                showError('矩阵减法要求两矩阵大小相同');
                return;
            }
            showMatrixResult('A − B', dataA.map((row, i) => row.map((v, j) => v - dataB[i][j])));
            break;
        case 'mul':
            if (matrixAData.cols !== matrixBData.rows) {
                showError(`A的列数(${matrixAData.cols})必须等于B的行数(${matrixBData.rows})`);
                return;
            }
            showMatrixResult('A × B', matrixMultiply(dataA, dataB));
            break;
        case 'mulR':
            if (matrixBData.cols !== matrixAData.rows) {
                showError(`B的列数(${matrixBData.cols})必须等于A的行数(${matrixAData.rows})`);
                return;
            }
            showMatrixResult('B × A', matrixMultiply(dataB, dataA));
            break;
    }
}

// ==================== 结果显示 ====================
function showScalarResult(label, value) {
    lastResult = { type: 'scalar', value };
    const area = document.getElementById('resultArea');
    area.innerHTML = `
        <div class="result-display">
            <div class="result-label">${label}</div>
            <div class="result-value">${formatNumber(value)}</div>
        </div>
    `;
}

function showMatrixResult(label, matrix) {
    lastResult = { type: 'matrix', value: matrix };
    const area = document.getElementById('resultArea');
    
    let tableHTML = '<table>';
    for (let i = 0; i < matrix.length; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < matrix[0].length; j++) {
            tableHTML += `<td>${formatNumber(matrix[i][j])}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';
    
    area.innerHTML = `
        <div class="result-display">
            <div class="result-label">${label}</div>
            <div class="result-matrix-wrapper">
                <span class="result-bracket">[</span>
                <div class="result-matrix">${tableHTML}</div>
                <span class="result-bracket">]</span>
            </div>
        </div>
    `;
}

function showError(message) {
    lastResult = null;
    const area = document.getElementById('resultArea');
    area.innerHTML = `
        <div class="error-display">
            <span class="error-icon">⚠️</span>
            <span>${message}</span>
        </div>
    `;
}

function clearResult() {
    lastResult = null;
    const area = document.getElementById('resultArea');
    area.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">📐</span>
            <p>输入矩阵并选择运算</p>
            <p class="hint">结果将显示在这里</p>
        </div>
    `;
}

function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return 'NaN';
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    if (Math.abs(num - Math.round(num)) < 1e-10) return Math.round(num).toString();
    return parseFloat(num.toFixed(4)).toString();
}

// ==================== 结果操作 ====================
function copyToClipboard() {
    if (!lastResult) return;
    
    let text = '';
    if (lastResult.type === 'scalar') {
        text = lastResult.value.toString();
    } else {
        text = lastResult.value.map(row => row.map(v => formatNumber(v)).join('\t')).join('\n');
    }
    
    navigator.clipboard.writeText(text).then(() => {
        // 可以添加复制成功提示
    });
}

function useAsInput() {
    if (!lastResult || lastResult.type !== 'matrix') return;
    
    const matrix = lastResult.value;
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    if (currentMode === 'single') {
        document.getElementById('singleRows').value = rows;
        document.getElementById('singleCols').value = cols;
        singleMatrixData.data = matrix.map(row => [...row]);
        initSingleMatrix(rows, cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                document.getElementById(`single_${i}_${j}`).value = formatNumber(matrix[i][j]);
            }
        }
    } else {
        // 多矩阵模式下复制到A
        document.getElementById('rowsA').value = rows;
        document.getElementById('colsA').value = cols;
        matrixAData.data = matrix.map(row => [...row]);
        initMatrix('A', rows, cols);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                document.getElementById(`A_${i}_${j}`).value = formatNumber(matrix[i][j]);
            }
        }
    }
}

// ==================== 帮助面板 ====================
function toggleHelp() {
    const panel = document.getElementById('helpPanel');
    panel.classList.toggle('active');
}

// ==================== 矩阵运算核心 ====================
function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    // LU分解法
    const mat = matrix.map(row => [...row]);
    let det = 1;
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
        }
        
        if (maxRow !== i) {
            [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
            det *= -1;
        }
        
        if (Math.abs(mat[i][i]) < 1e-10) return 0;
        
        det *= mat[i][i];
        
        for (let k = i + 1; k < n; k++) {
            const factor = mat[k][i] / mat[i][i];
            for (let j = i; j < n; j++) {
                mat[k][j] -= factor * mat[i][j];
            }
        }
    }
    
    return det;
}

function inverse(matrix) {
    const n = matrix.length;
    const aug = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
        }
        [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
        
        const pivot = aug[i][i];
        for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot;
        
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = aug[k][i];
                for (let j = 0; j < 2 * n; j++) aug[k][j] -= factor * aug[i][j];
            }
        }
    }
    
    return aug.map(row => row.slice(n));
}

function transpose(matrix) {
    return matrix[0].map((_, j) => matrix.map(row => row[j]));
}

function matrixRank(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const mat = matrix.map(row => [...row]);
    
    let rank = 0;
    const rowSelected = Array(m).fill(false);
    
    for (let j = 0; j < n; j++) {
        let pivot = -1;
        for (let i = 0; i < m; i++) {
            if (!rowSelected[i] && Math.abs(mat[i][j]) > 1e-10) {
                pivot = i;
                break;
            }
        }
        
        if (pivot === -1) continue;
        
        rowSelected[pivot] = true;
        rank++;
        
        for (let k = 0; k < m; k++) {
            if (k !== pivot && Math.abs(mat[k][j]) > 1e-10) {
                const factor = mat[k][j] / mat[pivot][j];
                for (let l = j; l < n; l++) mat[k][l] -= factor * mat[pivot][l];
            }
        }
    }
    
    return rank;
}

function toReducedRowEchelon(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    const mat = matrix.map(row => [...row]);
    
    let lead = 0;
    
    for (let r = 0; r < m && lead < n; r++) {
        let i = r;
        while (Math.abs(mat[i][lead]) < 1e-10) {
            i++;
            if (i === m) {
                i = r;
                lead++;
                if (lead === n) return mat;
            }
        }
        
        [mat[r], mat[i]] = [mat[i], mat[r]];
        
        const lv = mat[r][lead];
        mat[r] = mat[r].map(v => v / lv);
        
        for (let j = 0; j < m; j++) {
            if (j !== r) {
                const factor = mat[j][lead];
                for (let k = 0; k < n; k++) mat[j][k] -= factor * mat[r][k];
            }
        }
        
        lead++;
    }
    
    return mat;
}

function matrixPower(matrix, power) {
    const n = matrix.length;
    
    if (power === 0) {
        return Array(n).fill(null).map((_, i) => Array(n).fill(null).map((_, j) => i === j ? 1 : 0));
    }
    
    if (power === 1) return matrix.map(row => [...row]);
    
    let result = matrix.map(row => [...row]);
    for (let i = 1; i < power; i++) {
        result = matrixMultiply(result, matrix);
    }
    
    return result;
}

function matrixMultiply(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
    
    const result = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));
    
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    
    return result;
}

function calcEigenvalues(data) {
    const n = data.length;
    
    if (n === 2) {
        const a = data[0][0], b = data[0][1];
        const c = data[1][0], d = data[1][1];
        
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        
        let eigenvalues;
        if (discriminant >= 0) {
            const sqrt = Math.sqrt(discriminant);
            eigenvalues = [(trace + sqrt) / 2, (trace - sqrt) / 2];
            const area = document.getElementById('resultArea');
            area.innerHTML = `
                <div class="result-display">
                    <div class="result-label">特征值 λ</div>
                    <div class="result-value">λ₁ = ${formatNumber(eigenvalues[0])}</div>
                    <div class="result-value" style="margin-top:8px;">λ₂ = ${formatNumber(eigenvalues[1])}</div>
                </div>
            `;
        } else {
            const sqrt = Math.sqrt(-discriminant);
            const area = document.getElementById('resultArea');
            area.innerHTML = `
                <div class="result-display">
                    <div class="result-label">特征值 λ (复数)</div>
                    <div class="result-value">λ₁ = ${formatNumber(trace/2)} + ${formatNumber(sqrt/2)}i</div>
                    <div class="result-value" style="margin-top:8px;">λ₂ = ${formatNumber(trace/2)} − ${formatNumber(sqrt/2)}i</div>
                </div>
            `;
        }
        lastResult = null;
        return;
    }
    
    // 对于更大的矩阵使用幂法近似
    const eigenvalues = [];
    let mat = data.map(row => [...row]);
    
    for (let k = 0; k < Math.min(n, 3); k++) {
        const ev = powerMethod(mat);
        if (ev !== null) eigenvalues.push(ev);
        mat = deflate(mat, ev || 0);
    }
    
    const area = document.getElementById('resultArea');
    let html = '<div class="result-display"><div class="result-label">特征值 λ (近似)</div>';
    eigenvalues.forEach((ev, i) => {
        html += `<div class="result-value" style="${i > 0 ? 'margin-top:8px;' : ''}">λ${i+1} ≈ ${formatNumber(ev)}</div>`;
    });
    html += '</div>';
    area.innerHTML = html;
    lastResult = null;
}

function powerMethod(matrix, maxIter = 100, tol = 1e-10) {
    const n = matrix.length;
    let x = Array(n).fill(1);
    let eigenvalue = 0;
    
    for (let iter = 0; iter < maxIter; iter++) {
        const y = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) y[i] += matrix[i][j] * x[j];
        }
        
        let maxVal = 0;
        for (let i = 0; i < n; i++) {
            if (Math.abs(y[i]) > Math.abs(maxVal)) maxVal = y[i];
        }
        
        if (Math.abs(maxVal) < tol) return 0;
        
        for (let i = 0; i < n; i++) x[i] = y[i] / maxVal;
        
        if (Math.abs(maxVal - eigenvalue) < tol) return maxVal;
        
        eigenvalue = maxVal;
    }
    
    return eigenvalue;
}

function deflate(matrix, eigenvalue) {
    const n = matrix.length;
    const result = matrix.map(row => [...row]);
    for (let i = 0; i < n; i++) result[i][i] -= eigenvalue / n;
    return result;
}
