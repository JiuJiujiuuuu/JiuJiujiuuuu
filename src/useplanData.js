import { ref } from 'vue'
import useCommon from './useCommon';
import useComputerGr from './useComputerGr';
export default function () {
const { add, sub, mul, div, daysAfter, yxRound, firstDayNextMonth, addMonths } = useCommon();
const {ComputerGr,Computer1,Computer3} = useComputerGr();
const hkPlanData = ref([]); //还款计划表
const asDkGrzh = ref(); //个人账户
const asGrxm = ref(""); //姓名
const asSfzhm = ref(); //身份证号
const adcDkje = ref(0.00); //贷款金额
const aiHkfs = ref(); //还款方式
const aiDkqx = ref(0); //贷款期限
const aiHkDay = ref(20); //还款日
const adtDkFf = ref(); //贷款方式
const adcDkNll = ref(0.00); //年利率
const lsBankJsfs = ref(""); //银行计算方式
const aiJsfs = ref(); //计算方式
const createGrHkPlanData = () => {
    let adcYhk2 = 0.00;
    let adcYhlx2 = 0.00;
    let ldcDebjYhk = 0.00;

    let adcDkye = adcDkje.value; //贷款余额
    let adtDk = adtDkFf.value; //贷款方式
    let adcNll = adcDkNll.value / 100;
    let ldcYhbx = 0.00; //本金
    let result;

    if (aiHkDay.value <= 0 || aiHkDay.value > 28) {
        aiHkDay.value = 20;
    }
        for (let liCsDkqx = 1; liCsDkqx <= aiDkqx.value; liCsDkqx++) {
            let ldtTempMonth = new Date(adtDk);
            ldtTempMonth.setMonth(ldtTempMonth.getMonth() + liCsDkqx);
            let aiReserveDkqx = aiDkqx.value - liCsDkqx + 1;
            let year = ldtTempMonth.getFullYear();
            let month = ldtTempMonth.getMonth() + 1;
            let dtHk = new Date(year, month - 1, aiHkDay.value);
            if (liCsDkqx === 1) {
                result = computerGrFirstMonth(adtDk, aiReserveDkqx, adcDkye, adcNll, adcYhk2, adcYhlx2);
                adcYhk2=result.adcYhk.value;
                adcYhlx2=result.adcYhlx.value;
                ldcDebjYhk = adcYhk2;
            } else {
                if (liCsDkqx === aiDkqx.value) {//最后一个月
                    dtHk = new Date(year, month - 1, adtDk.getDate());
                    let adtDkEndDay = dtHk;
                    result = computerGrLastMonth(adtDkEndDay, aiReserveDkqx, adcDkye, adcNll, adcYhk2, adcYhlx2);
                } else {
                    result = ComputerGr(aiReserveDkqx, adcDkye, adcNll, aiHkfs, aiJsfs, adcYhk2, adcYhlx2);
                }
                adcYhk2=result.adcYhk.value;
                adcYhlx2=result.adcYhlx.value;
            }

            if (liCsDkqx === 2) {//第二个月记录月还本息
                ldcYhbx = adcYhk2 + adcYhlx2;
            }

            if (aiHkfs.value === 1 && liCsDkqx > 2 && liCsDkqx !== aiDkqx.value) {
                ldcYhbx = adcYhk2 + adcYhlx2;
            }

            if (aiHkfs.value === 3 && liCsDkqx > 1 && liCsDkqx !== aiDkqx.value) {
                adcYhk2 = ldcDebjYhk;
            }

            ldcYhbx = add(adcYhk2,adcYhlx2).toFixed(2);
            adcDkye = sub(adcDkye,adcYhk2).toFixed(2);
            const newData ={
                asDkGrzh: asDkGrzh.value,
                asGrxm: asGrxm.value,
                asSfzhm: asSfzhm.value,
                IYear: year,
                IMonth: month,
                adcDkNll: adcDkNll.value,
                aiHkDay: aiHkDay.value,
                DtHk: dtHk,
                liCsDkqx : liCsDkqx,
                dcBj: adcYhk2, //本金
                dcLx: adcYhlx2, //利息
                dcBx: ldcYhbx, //本息
                dcDkye: adcDkye, 
            };
            hkPlanData.value.push(newData);
        }
}
const computerGrFirstMonth = (adtDk, aiReserveDkqx, adcDkye, adcNll,adcYhk2, adcYhlx2) => {
    let ldcMonthHj = 0.00;
    let liHkfs = aiHkfs.value;
    let bankJsfs = lsBankJsfs.value;
    let liHkDay = aiHkDay.value;
    let ldcYll = 0.00;
    let ldcDkye = 0.00;
    let liTempDays = 0;
    const adcYhk = ref(adcYhk2);
    const adcYhlx = ref(adcYhlx2);
    ldcYll = adcNll / 12;
    ldcDkye = adcDkye;
    //根据贷款日期和系统的日期的时间差，算出已经应该还款的期数，总贷款期数减去已经应该还款的期数就是剩余期数
    let ldtTemp = new Date(2014, 0, 1);

    switch (bankJsfs) {
        case "固定还款日"://光大，交行
            ldtTemp = firstDayNextMonth(adtDk.getFullYear(), adtDk.getMonth());
            liTempDays = daysAfter(adtDk, new Date(ldtTemp.getFullYear(), ldtTemp.getMonth()+1, liHkDay));
            break;
        case "固定还款日本金少"://中行
            ldtTemp = firstDayNextMonth(adtDk.getFullYear(), adtDk.getMonth());
            liTempDays = daysAfter(adtDk, new Date(ldtTemp.getFullYear(), ldtTemp.getMonth()+1, liHkDay));
            break;
        default:
            break;
    }

    switch (liHkfs) {
        case 1:
            ldcMonthHj = Computer1(aiJsfs,ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx);
            switch (bankJsfs) {//光大，交行
                case "固定还款日":
                    adcYhlx.value = yxRound(div(mul(mul(ldcDkye,liTempDays),ldcYll),30), 2);
                    ldcMonthHj = adcYhk.value + adcYhlx.value;
                    break;
                case "固定还款日本金少"://中行
                    adcYhlx.value = yxRound(div(mul(mul(ldcDkye,liTempDays),ldcYll),30), 2);
                    adcYhk.value = ldcMonthHj - adcYhlx.value;
                    break;
                default:
                    break;
            }
            break;
        /* case 2:
            ldcMonthHj = Computer2(ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx, asError);
            break; */
        case 3:
            ldcMonthHj = Computer3(ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx);
            switch (bankJsfs) {
                case "固定还款日"://光大，交行
                    adcYhlx.value = yxRound(div(mul(mul(ldcDkye,liTempDays),ldcYll),30), 2);
                    break;
                default:
                    break;
            }
            ldcMonthHj = adcYhk.value + adcYhlx.value;
            break;
        /* case 4:
            ldcMonthHj = Computer4(adcYhk, adcYhlx);
            break; */
    }
    return { adcYhk, adcYhlx, ldcMonthHj };
}
//最后一个月
const computerGrLastMonth = (adtDkEndDay, aiReserveDkqx, adcDkye, adcNll, adcYhk2, adcYhlx2) => {
    let ldcMonthHj = 0.00;
    let liHkfs = aiHkfs.value;
    let bankJsfs = lsBankJsfs.value;
    let ldcYll = 0.00;
    let ldcDkye = 0.00;
    let liHkDay = 20;
    let liTempDays = 0;
    const adcYhk = ref(adcYhk2);
    const adcYhlx = ref(adcYhlx2);
    ldcYll = adcNll / 12;
    ldcDkye = adcDkye;
 //根据贷款日期和系统的日期的时间差，算出已经应该还款的期数，总贷款期数减去已经应该还款的期数就是剩余期数
    let ldtTemp = new Date(2014, 0, 1);

    switch (bankJsfs) {
        case "固定还款日"://光大，交行
            {const liTempMonth = addMonths(new Date(adtDkEndDay), -1).getMonth()+1;
            const liTempYear = addMonths(new Date(adtDkEndDay), -1).getFullYear();
            ldtTemp = new Date(liTempYear, liTempMonth, liHkDay);
            liTempDays = daysAfter(ldtTemp, adtDkEndDay);
            break;}
        case "固定还款日本金少"://中行
            
            break;
        default:
            break;
    }
    adcYhk.value = ldcDkye;
    switch (liHkfs) {
        case 1:
        ldcMonthHj = Computer1(aiJsfs,ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx);
            switch (bankJsfs) {
                case "固定还款日"://光大，交行
                    adcYhlx.value = yxRound(div(mul(mul(ldcDkye,liTempDays),ldcYll),30), 2);
                    ldcMonthHj = adcYhk.value + adcYhlx.value;
                    break;
                case "固定还款日本金少"://中行
                    adcYhlx.value = yxRound(div(mul(mul(ldcDkye,liTempDays),ldcYll),30), 2);
                    adcYhk.value = ldcMonthHj - adcYhlx.value;
                    break;
                default:
                    break;
            }
            break;
        /* case 2:
            ldcMonthHj = Computer2(ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx, asError);
            break; */
        case 3:
            ldcMonthHj = Computer3(ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx);
            switch (bankJsfs) {
                case "固定还款日"://光大，交行
                    adcYhlx.value = yxRound(div(mul(mul(ldcDkye,liTempDays),ldcYll),30), 2);
                    break;
                default:
                    break;
            }
            ldcMonthHj = adcYhk.value + adcYhlx.value;
            break;
        /* case 4:
            ldcMonthHj = Computer4(adcYhk, adcYhlx);
            break ;*/
    }
    return { adcYhk, adcYhlx, ldcMonthHj };
}
return {createGrHkPlanData,hkPlanData,asDkGrzh,asGrxm,asSfzhm,adcDkje,aiHkfs,aiDkqx,aiHkDay,adtDkFf,adcDkNll,lsBankJsfs,aiJsfs};
}