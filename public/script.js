let currentExpression = ''; 
let justCalculated = false; 
let lastResult = null;

function appendKey(key) {
    if (isOperator(key)) {
        if ((currentExpression === '' && lastResult === null)) {
            return;
        }
        if (justCalculated) {
            currentExpression = (lastResult !== null ? lastResult : 0) + key;
            justCalculated = false;
        } else {
            // 二重演算子防止
            if (isOperator(currentExpression.slice(-1))) {
                currentExpression = currentExpression.slice(0, -1) + key;
            } else {
                currentExpression += key;
            }
        }
    } else {
        // 数字入力
        if (justCalculated) {
            currentExpression = key;
            justCalculated = false;
            lastResult = null;
        } else {
            currentExpression += key;
        }

        // 数字入力後に先頭ゼロ削除処理
        currentExpression = trimLeadingZeros(currentExpression);
    }

    updateDisplay(currentExpression);
}

function calculate() {
    if (currentExpression === '' || isOperator(currentExpression.slice(-1))) {
        return; 
    }

    try {
        const evalExpression = currentExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');

        const result = eval(evalExpression);
        appendToHistory(`${currentExpression}=${result}`);
        updateDisplay(result.toString());
        justCalculated = true;
        lastResult = result;
    } catch (e) {
        updateDisplay('Error');
        justCalculated = true;
        lastResult = null;
    }
}

function clearAll() {
    currentExpression = '';
    justCalculated = false;
    lastResult = null;
    updateDisplay('0');
}

function updateDisplay(value) {
    const display = document.getElementById('display');
    display.value = value;
}

function appendToHistory(text) {
    const history = document.getElementById('history');
    const entry = document.createElement('p');
    entry.textContent = text;

    if (history.firstChild && history.firstChild.classList.contains('enlarged')) {
        history.firstChild.classList.remove('enlarged');
    }

    if (history.firstChild) {
        history.insertBefore(entry, history.firstChild);
    } else {
        history.appendChild(entry);
    }

    entry.classList.add('highlight');
    entry.addEventListener('animationend', () => {
        entry.classList.remove('highlight');
        entry.classList.add('enlarged');
    }, { once: true });
}

function toggleHistoryExpanded() {
    const history = document.getElementById('history');
    history.classList.toggle('expanded');
}

function isOperator(ch) {
    return ['+', '-', '×', '÷'].includes(ch);
}

/**
 * 入力中の式から最後のオペランド(数字列)を抽出し、先頭ゼロを削除。
 * 例:
 *  currentExpression = "001+02" -> "1+2"
 *  currentExpression = "000" -> "0"
 */
function trimLeadingZeros(expr) {
    // 演算子で分割して最後のオペランドを取得
    const tokens = expr.split(/[+\-×÷]/);
    let lastOperand = tokens[tokens.length - 1];

    if (lastOperand === '') {
        // まだオペランドなし
        return expr;
    }

    // 先頭ゼロ除去
    // 全てがゼロなら「0」だけ残す
    if (/^0+$/.test(lastOperand)) {
        lastOperand = '0';
    } else {
        // 先頭ゼロを削除 (ただし全部ゼロではないことが上で確認できているので安心)
        lastOperand = lastOperand.replace(/^0+/, '');
    }

    // 最後のオペランドを置き換える
    // 最後のオペランド以外はそのまま
    let front = expr.slice(0, expr.length - tokens[tokens.length - 1].length);
    return front + lastOperand;
}
