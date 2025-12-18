// ==================== 矩阵计算器核心逻辑 ====================

// 全局变量
let matrixA = { rows: 3, cols: 3, data: [] };
let matrixB = { rows: 3, cols: 3, data: [] };
let resultMatrix = null;

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initMatrix('A', 3, 3);
    initMatrix('B', 3, 3);
});

// ==================== 矩阵初始化和UI ====================

function initMatrix(name, rows, cols) {
    const container = document.getElementById('matrix' + name);
    const matrix = name === 'A' ? matrixA : matrixB;
    matrix.rows = rows;
    matrix.cols = cols;
    
    let html = '<table class="matrix-table">';
    for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < cols; j++) {
            const value = matrix.data[i] && matrix.data[i][j] !== undefined ? matrix.data[i][j] : '';
            html += `<td><input type="text" id="${name}_${i}_${j}" value="${value}" 
                     oninput="updateMatrixValue('${name}', ${i}, ${j}, this.value)"
                     onkeydown="handleKeyNav(event, '${name}', ${i}, ${j})"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;
    
    // 初始化数据数组
    if (!matrix.data.length) {
        matrix.data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    }
}

function resizeMatrix(name) {
    const rows = parseInt(document.getElementById('rows' + name).value) || 3;
    const cols = parseInt(document.getElementById('cols' + name).value) || 3;
    
    if (rows < 1 || rows > 10 || cols < 1 || cols > 10) {
        showError('矩阵大小应在1-10之间');
        return;
    }
    
    const matrix = name === 'A' ? matrixA : matrixB;
    const oldData = matrix.data;
    matrix.data = [];
    
    for (let i = 0; i < rows; i++) {
        matrix.data[i] = [];
        for (let j = 0; j < cols; j++) {
            matrix.data[i][j] = (oldData[i] && oldData[i][j] !== undefined) ? oldData[i][j] : 0;
        }
    }
    
    initMatrix(name, rows, cols);
}

function updateMatrixValue(name, row, col, value) {
    const matrix = name === 'A' ? matrixA : matrixB;
    matrix.data[row][col] = value;
}

function handleKeyNav(event, name, row, col) {
    const matrix = name === 'A' ? matrixA : matrixB;
    let newRow = row, newCol = col;
    
    switch(event.key) {
        case 'ArrowUp': newRow = Math.max(0, row - 1); break;
        case 'ArrowDown': newRow = Math.min(matrix.rows - 1, row + 1); break;
        case 'ArrowLeft': if (event.target.selectionStart === 0) newCol = Math.max(0, col - 1); else return; break;
        case 'ArrowRight': if (event.target.selectionStart === event.target.value.length) newCol = Math.min(matrix.cols - 1, col + 1); else return; break;
        case 'Enter': case ' ': newCol = (col + 1) % matrix.cols; if (newCol === 0) newRow = Math.min(matrix.rows - 1, row + 1); break;
        case 'Tab': return;
        default: return;
    }
    
    if (newRow !== row || newCol !== col) {
        event.preventDefault();
        document.getElementById(`${name}_${newRow}_${newCol}`).focus();
    }
}

// ==================== 辅助函数 ====================

function clearMatrix(name) {
    const matrix = name === 'A' ? matrixA : matrixB;
    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            matrix.data[i][j] = 0;
            document.getElementById(`${name}_${i}_${j}`).value = '';
        }
    }
}

function fillRandom(name) {
    const matrix = name === 'A' ? matrixA : matrixB;
    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            const val = Math.floor(Math.random() * 19) - 9; // -9 to 9
            matrix.data[i][j] = val;
            document.getElementById(`${name}_${i}_${j}`).value = val;
        }
    }
}

function fillIdentity(name) {
    const matrix = name === 'A' ? matrixA : matrixB;
    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            const val = i === j ? 1 : 0;
            matrix.data[i][j] = val;
            document.getElementById(`${name}_${i}_${j}`).value = val;
        }
    }
}

function getMatrixData(name) {
    const matrix = name === 'A' ? matrixA : matrixB;
    const data = [];
    
    for (let i = 0; i < matrix.rows; i++) {
        data[i] = [];
        for (let j = 0; j < matrix.cols; j++) {
            const input = document.getElementById(`${name}_${i}_${j}`);
            const value = parseValue(input.value);
            if (isNaN(value)) {
                showError(`矩阵${name}中第${i+1}行第${j+1}列的值无效`);
                return null;
            }
            data[i][j] = value;
        }
    }
    
    return data;
}

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
    
    // 尝试直接解析
    try {
        // 简单表达式求值
        const result = Function('"use strict"; return (' + str + ')')();
        return typeof result === 'number' ? result : NaN;
    } catch (e) {
        return parseFloat(str);
    }
}

// ==================== 结果显示 ====================

function showResult(label, value, isMatrix = false) {
    const resultDiv = document.getElementById('result');
    
    if (isMatrix) {
        resultMatrix = value;
        let html = `<div class="result-matrix"><p class="result-label">${label}</p>`;
        html += '<table class="matrix-display">';
        for (let i = 0; i < value.length; i++) {
            html += '<tr>';
            for (let j = 0; j < value[0].length; j++) {
                html += `<td>${formatNumber(value[i][j])}</td>`;
            }
            html += '</tr>';
        }
        html += '</table></div>';
        resultDiv.innerHTML = html;
    } else {
        resultMatrix = null;
        resultDiv.innerHTML = `<p class="result-label">${label}</p><p class="result-value">${formatNumber(value)}</p>`;
    }
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    resultMatrix = null;
}

function showSteps(steps) {
    const stepsDiv = document.getElementById('steps');
    const stepsContent = document.getElementById('stepsContent');
    
    if (steps && steps.length > 0) {
        stepsDiv.style.display = 'block';
        stepsContent.innerHTML = steps.map((step, i) => 
            `<div class="step"><strong>步骤 ${i+1}:</strong> ${step}</div>`
        ).join('');
    } else {
        stepsDiv.style.display = 'none';
    }
}

function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return 'NaN';
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    
    // 检查是否接近整数
    if (Math.abs(num - Math.round(num)) < 1e-10) {
        return Math.round(num).toString();
    }
    
    // 尝试转换为分数显示
    const frac = toFraction(num);
    if (frac) return frac;
    
    // 保留4位小数
    return parseFloat(num.toFixed(6)).toString();
}

function toFraction(decimal, tolerance = 1e-10) {
    if (Math.abs(decimal - Math.round(decimal)) < tolerance) {
        return null; // 是整数
    }
    
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    
    for (let i = 0; i < 20; i++) {
        let a = Math.floor(b);
        let h = a * h1 + h2;
        let k = a * k1 + k2;
        
        h2 = h1; h1 = h;
        k2 = k1; k1 = k;
        
        if (Math.abs(decimal - h / k) < tolerance && k < 1000) {
            return `${h}/${k}`;
        }
        
        if (b - a < tolerance) break;
        b = 1 / (b - a);
    }
    
    return null;
}

function clearResult() {
    document.getElementById('result').innerHTML = '<p class="placeholder">结果将在这里显示...</p>';
    document.getElementById('steps').style.display = 'none';
    resultMatrix = null;
}

function copyResultToA() {
    if (!resultMatrix) {
        showError('没有可复制的结果矩阵');
        return;
    }
    
    document.getElementById('rowsA').value = resultMatrix.length;
    document.getElementById('colsA').value = resultMatrix[0].length;
    matrixA.data = resultMatrix.map(row => [...row]);
    initMatrix('A', resultMatrix.length, resultMatrix[0].length);
    
    for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
            document.getElementById(`A_${i}_${j}`).value = formatNumber(resultMatrix[i][j]);
        }
    }
}

function copyResultToB() {
    if (!resultMatrix) {
        showError('没有可复制的结果矩阵');
        return;
    }
    
    document.getElementById('rowsB').value = resultMatrix.length;
    document.getElementById('colsB').value = resultMatrix[0].length;
    matrixB.data = resultMatrix.map(row => [...row]);
    initMatrix('B', resultMatrix.length, resultMatrix[0].length);
    
    for (let i = 0; i < resultMatrix.length; i++) {
        for (let j = 0; j < resultMatrix[0].length; j++) {
            document.getElementById(`B_${i}_${j}`).value = formatNumber(resultMatrix[i][j]);
        }
    }
}

// ==================== 矩阵运算 ====================

// 行列式
function calculateDeterminant(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const matrix = name === 'A' ? matrixA : matrixB;
    if (matrix.rows !== matrix.cols) {
        showError('行列式只能计算方阵');
        return;
    }
    
    const det = determinant(data);
    showResult(`矩阵${name}的行列式 |${name}|`, det);
}

function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    // LU分解法计算行列式
    const { L, U, P, swaps } = luDecomposition(matrix);
    let det = Math.pow(-1, swaps);
    for (let i = 0; i < n; i++) {
        det *= U[i][i];
    }
    return det;
}

// 逆矩阵
function calculateInverse(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const matrix = name === 'A' ? matrixA : matrixB;
    if (matrix.rows !== matrix.cols) {
        showError('只有方阵才有逆矩阵');
        return;
    }
    
    const det = determinant(data);
    if (Math.abs(det) < 1e-10) {
        showError('矩阵奇异（行列式为0），不存在逆矩阵');
        return;
    }
    
    const inv = inverse(data);
    showResult(`矩阵${name}的逆矩阵 ${name}⁻¹`, inv, true);
}

function inverse(matrix) {
    const n = matrix.length;
    
    // 创建增广矩阵 [A|I]
    const aug = matrix.map((row, i) => {
        const newRow = [...row];
        for (let j = 0; j < n; j++) {
            newRow.push(i === j ? 1 : 0);
        }
        return newRow;
    });
    
    // Gauss-Jordan消元
    for (let i = 0; i < n; i++) {
        // 找主元
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) {
                maxRow = k;
            }
        }
        [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
        
        const pivot = aug[i][i];
        for (let j = 0; j < 2 * n; j++) {
            aug[i][j] /= pivot;
        }
        
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = aug[k][i];
                for (let j = 0; j < 2 * n; j++) {
                    aug[k][j] -= factor * aug[i][j];
                }
            }
        }
    }
    
    // 提取逆矩阵
    return aug.map(row => row.slice(n));
}

// 转置
function calculateTranspose(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const trans = transpose(data);
    showResult(`矩阵${name}的转置 ${name}ᵀ`, trans, true);
}

function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    
    for (let j = 0; j < cols; j++) {
        result[j] = [];
        for (let i = 0; i < rows; i++) {
            result[j][i] = matrix[i][j];
        }
    }
    
    return result;
}

// 秩
function calculateRank(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const rank = matrixRank(data);
    showResult(`矩阵${name}的秩 rank(${name})`, rank);
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
                for (let l = j; l < n; l++) {
                    mat[k][l] -= factor * mat[pivot][l];
                }
            }
        }
    }
    
    return rank;
}

// 迹
function calculateTrace(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const matrix = name === 'A' ? matrixA : matrixB;
    if (matrix.rows !== matrix.cols) {
        showError('迹只能计算方阵');
        return;
    }
    
    let trace = 0;
    for (let i = 0; i < data.length; i++) {
        trace += data[i][i];
    }
    
    showResult(`矩阵${name}的迹 tr(${name})`, trace);
}

// 幂运算
function calculatePower(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const matrix = name === 'A' ? matrixA : matrixB;
    if (matrix.rows !== matrix.cols) {
        showError('幂运算只能计算方阵');
        return;
    }
    
    const power = parseInt(prompt('请输入幂次（正整数）:', '2'));
    if (isNaN(power) || power < 0) {
        showError('请输入有效的非负整数');
        return;
    }
    
    const result = matrixPower(data, power);
    showResult(`矩阵${name}的${power}次幂 ${name}^${power}`, result, true);
}

function matrixPower(matrix, power) {
    const n = matrix.length;
    
    if (power === 0) {
        // 返回单位矩阵
        return Array(n).fill(null).map((_, i) => 
            Array(n).fill(null).map((_, j) => i === j ? 1 : 0)
        );
    }
    
    if (power === 1) return matrix.map(row => [...row]);
    
    let result = matrix.map(row => [...row]);
    for (let i = 1; i < power; i++) {
        result = matrixMultiplyCalc(result, matrix);
    }
    
    return result;
}

// 标量乘法
function scalarMultiply(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const scalar = parseFloat(document.getElementById('scalar' + name).value);
    if (isNaN(scalar)) {
        showError('请输入有效的标量值');
        return;
    }
    
    const result = data.map(row => row.map(val => val * scalar));
    showResult(`${scalar} × 矩阵${name}`, result, true);
}

// 行阶梯形
function rowEchelon(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const result = toRowEchelon(data);
    showResult(`矩阵${name}的行阶梯形`, result, true);
}

function toRowEchelon(matrix) {
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
        
        for (let j = r + 1; j < m; j++) {
            const factor = mat[j][lead];
            for (let k = 0; k < n; k++) {
                mat[j][k] -= factor * mat[r][k];
            }
        }
        
        lead++;
    }
    
    return mat;
}

// 简化行阶梯形
function reducedRowEchelon(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const result = toReducedRowEchelon(data);
    showResult(`矩阵${name}的简化行阶梯形 (RREF)`, result, true);
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
                for (let k = 0; k < n; k++) {
                    mat[j][k] -= factor * mat[r][k];
                }
            }
        }
        
        lead++;
    }
    
    return mat;
}

// 特征值（仅支持2x2和3x3矩阵的精确解）
function calculateEigenvalues(name) {
    const data = getMatrixData(name);
    if (!data) return;
    
    const matrix = name === 'A' ? matrixA : matrixB;
    if (matrix.rows !== matrix.cols) {
        showError('特征值只能计算方阵');
        return;
    }
    
    const n = data.length;
    
    if (n === 2) {
        // 2x2矩阵特征值
        const a = data[0][0], b = data[0][1];
        const c = data[1][0], d = data[1][1];
        
        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;
        
        let eigenvalues;
        if (discriminant >= 0) {
            const sqrt = Math.sqrt(discriminant);
            eigenvalues = [(trace + sqrt) / 2, (trace - sqrt) / 2];
        } else {
            const sqrt = Math.sqrt(-discriminant);
            eigenvalues = [
                `${trace/2} + ${sqrt/2}i`,
                `${trace/2} - ${sqrt/2}i`
            ];
        }
        
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <p class="result-label">矩阵${name}的特征值</p>
            <p class="result-value">λ₁ = ${formatNumber(eigenvalues[0])}</p>
            <p class="result-value">λ₂ = ${formatNumber(eigenvalues[1])}</p>
        `;
        resultMatrix = null;
        return;
    }
    
    // 使用幂法和位移策略近似计算特征值
    const eigenvalues = powerMethodAllEigenvalues(data);
    
    const resultDiv = document.getElementById('result');
    let html = `<p class="result-label">矩阵${name}的特征值（近似）</p>`;
    eigenvalues.forEach((ev, i) => {
        html += `<p class="result-value">λ${i+1} ≈ ${formatNumber(ev)}</p>`;
    });
    resultDiv.innerHTML = html;
    resultMatrix = null;
}

function powerMethodAllEigenvalues(matrix) {
    const n = matrix.length;
    const eigenvalues = [];
    let mat = matrix.map(row => [...row]);
    
    for (let k = 0; k < n; k++) {
        const ev = powerMethod(mat);
        if (ev === null) break;
        eigenvalues.push(ev);
        
        // 使用deflation方法
        if (k < n - 1) {
            mat = deflate(mat, ev);
        }
    }
    
    return eigenvalues;
}

function powerMethod(matrix, maxIter = 100, tol = 1e-10) {
    const n = matrix.length;
    let x = Array(n).fill(1);
    let eigenvalue = 0;
    
    for (let iter = 0; iter < maxIter; iter++) {
        // y = Ax
        const y = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                y[i] += matrix[i][j] * x[j];
            }
        }
        
        // 找最大元素
        let maxVal = 0;
        for (let i = 0; i < n; i++) {
            if (Math.abs(y[i]) > Math.abs(maxVal)) {
                maxVal = y[i];
            }
        }
        
        if (Math.abs(maxVal) < tol) return 0;
        
        // 归一化
        for (let i = 0; i < n; i++) {
            x[i] = y[i] / maxVal;
        }
        
        if (Math.abs(maxVal - eigenvalue) < tol) {
            return maxVal;
        }
        
        eigenvalue = maxVal;
    }
    
    return eigenvalue;
}

function deflate(matrix, eigenvalue) {
    const n = matrix.length;
    const result = matrix.map(row => [...row]);
    
    // 简单的deflation
    for (let i = 0; i < n; i++) {
        result[i][i] -= eigenvalue / n;
    }
    
    return result;
}

// LU分解
function luDecomposition(matrix) {
    const n = matrix.length;
    const L = Array(n).fill(null).map(() => Array(n).fill(0));
    const U = matrix.map(row => [...row]);
    const P = Array(n).fill(null).map((_, i) => i);
    let swaps = 0;
    
    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
    }
    
    for (let k = 0; k < n; k++) {
        // 选主元
        let maxRow = k;
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(U[i][k]) > Math.abs(U[maxRow][k])) {
                maxRow = i;
            }
        }
        
        if (maxRow !== k) {
            [U[k], U[maxRow]] = [U[maxRow], U[k]];
            [P[k], P[maxRow]] = [P[maxRow], P[k]];
            // 交换L的已计算部分
            for (let j = 0; j < k; j++) {
                [L[k][j], L[maxRow][j]] = [L[maxRow][j], L[k][j]];
            }
            swaps++;
        }
        
        for (let i = k + 1; i < n; i++) {
            if (Math.abs(U[k][k]) > 1e-10) {
                L[i][k] = U[i][k] / U[k][k];
                for (let j = k; j < n; j++) {
                    U[i][j] -= L[i][k] * U[k][j];
                }
            }
        }
    }
    
    return { L, U, P, swaps };
}

// ==================== 双矩阵运算 ====================

function matrixAdd() {
    const dataA = getMatrixData('A');
    const dataB = getMatrixData('B');
    if (!dataA || !dataB) return;
    
    if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) {
        showError('矩阵加法要求两个矩阵大小相同');
        return;
    }
    
    const result = dataA.map((row, i) => row.map((val, j) => val + dataB[i][j]));
    showResult('A + B', result, true);
}

function matrixSubtract() {
    const dataA = getMatrixData('A');
    const dataB = getMatrixData('B');
    if (!dataA || !dataB) return;
    
    if (matrixA.rows !== matrixB.rows || matrixA.cols !== matrixB.cols) {
        showError('矩阵减法要求两个矩阵大小相同');
        return;
    }
    
    const result = dataA.map((row, i) => row.map((val, j) => val - dataB[i][j]));
    showResult('A - B', result, true);
}

function matrixMultiply() {
    const dataA = getMatrixData('A');
    const dataB = getMatrixData('B');
    if (!dataA || !dataB) return;
    
    if (matrixA.cols !== matrixB.rows) {
        showError(`矩阵乘法要求A的列数(${matrixA.cols})等于B的行数(${matrixB.rows})`);
        return;
    }
    
    const result = matrixMultiplyCalc(dataA, dataB);
    showResult('A × B', result, true);
}

function matrixMultiplyReverse() {
    const dataA = getMatrixData('A');
    const dataB = getMatrixData('B');
    if (!dataA || !dataB) return;
    
    if (matrixB.cols !== matrixA.rows) {
        showError(`矩阵乘法要求B的列数(${matrixB.cols})等于A的行数(${matrixA.rows})`);
        return;
    }
    
    const result = matrixMultiplyCalc(dataB, dataA);
    showResult('B × A', result, true);
}

function matrixMultiplyCalc(A, B) {
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
