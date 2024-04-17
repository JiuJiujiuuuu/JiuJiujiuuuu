export default function (){
const daysAfter = (date1, date2) => {
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
} 

const yxRound = (number, decimals) => {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

const firstDayNextMonth = (year, month) => {
    let nextMonth = month + 1;
    if (nextMonth === 11) {
    year += 1;
    nextMonth = 1;
    }
    const date = new Date(year, nextMonth - 1, 1);
    return date;
}

const addMonths = (date, months) => {
    let year = date.getFullYear();
    let month = date.getMonth() + months ;
    if(month === 1) {
        month = 12;
        year -= 1;
    } else if(month === 12) {
        month = 1;
        year += 1;
    } else {
        month += months;
        if(month > 12) {
            month -= 12;
            year += 1;
        }
    }
    return new Date(year, month, date.getDate());
};

const add = (a,b) => {// 精确运算 加
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

// 精确运算 减
const sub = (a, b) => {
    var c, d, e;
    try {
        c = a.toString().split(".")[1].length;
    } catch (f) {
        c = 0;
    }
    try {
        d = b.toString().split(".")[1].length;
    } catch (f) {
        d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}

// 精确运算 乘
const mul = (a, b) => {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) {
        // 不需要处理异常情况
    }
    try {
        c += e.split(".")[1].length;
    } catch (f) {
        // 不需要处理异常情况
    } 
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

// 精确运算 除
const div = (a, b) => {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) {
        // 不需要处理异常情况
    }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) {
        // 不需要处理异常情况
    }
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
};
const getIntConfig = (key, value) => {
    const intValue = parseInt(key, 10);
    // 检查是否成功转换为整数，如果成功则返回整数值，否则返回默认值
    if (!isNaN(intValue)) {
        return intValue;
    } else {
        return value;
    }
}

const fIntCifang = (number, cifang) => {
    const result = Math.pow(number,cifang);
    return result.toFixed(2);
}

const fMonthBetweenDates = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    return months;
}
return  {
    add,
    sub,
    mul,
    div,
    daysAfter,
    yxRound,
    firstDayNextMonth,
    addMonths,
    getIntConfig,
    fIntCifang,
    fMonthBetweenDates
};
}
