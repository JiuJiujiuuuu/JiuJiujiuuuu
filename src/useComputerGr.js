import useCommon from './useCommon';
import {ref} from 'vue';
export default function (){
const { add, sub, mul, div} = useCommon();
const ComputerGr = (aiReserveDkqx, adcDkye, adcNll, aiHkfs, aiJsfs, adcYhk2, adcYhlx2) => {
    let ldcMonthHj = 0.00; 
    let liHkfs = aiHkfs;
    let ldcYll = adcNll / 12; 
    let ldcDkye = adcDkye;  //贷款余额 
    const adcYhk = ref(adcYhk2);
    const adcYhlx = ref(adcYhlx2);

     switch (liHkfs) {
        case 1:
            ldcMonthHj = Computer1(aiJsfs,ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx);
            break;
        case 3:
            ldcMonthHj = Computer3(ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx);
            //ldcMonthHj = add(adcYhk,adcYhlx);
            break;
    }
    return { adcYhk, adcYhlx, ldcMonthHj };
}

const Computer1 = (aiJsfs,ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx)  =>{//等额还款法
    // 说明
   // ldcDkye: 贷款金额
   // ldcYll: 利率
   // aiReserveDkqx: 月数
   // adcYhk: 已还款金额
   // adcYhlx: 已还利息

   // 等额还款法计算
   // 每月等额还贷款本息合计=[A * (1+I)^T] / [(1+I)^T - 1]
   // 其中: A=贷款额; I=贷款月利率; T=贷款期限*12 (如:10年期贷款,T=10*12=120 个月)
   let ldcMonthHj = 0.00;
   let ldcCifang = 0.00;

   ldcCifang = Math.pow(add(1,ldcYll), aiReserveDkqx);

   if (ldcCifang == 0) {
       ldcCifang = 1;
   }

   let liJsfs = aiJsfs; // 计算方式,1按1万为单位或2实际金额作为贷款参数
   
   if (liJsfs != 2) {
       liJsfs = 1;
   }

   if (liJsfs == 1) { // 按万为单位
       if (ldcYll != 0) {
           ldcMonthHj = mul((div(ldcDkye,10000.00)),( div((mul(mul(10000.00,ldcYll),ldcCifang)),sub(ldcCifang,1)) ) ).toFixed(2);
       } else {
           ldcMonthHj = 0.00;
       }
   } else { // 按实际贷款金额为单位
       if (ldcYll != 0) {
           ldcMonthHj = div(mul(ldcDkye,(mul(ldcYll,ldcCifang))),sub(ldcCifang,1)).toFixed(2);
       } else {
           ldcMonthHj = 0.00;
       }
   }
   let ldcYhlx = (mul(ldcDkye,ldcYll)).toFixed(2);
   let ldcYhk = (sub(ldcMonthHj,ldcYhlx)).toFixed(2);
   adcYhk.value = ldcYhk;
   adcYhlx.value = ldcYhlx;
   return ldcMonthHj;
}
const Computer3 = (ldcDkye, ldcYll, aiReserveDkqx, adcYhk, adcYhlx) => {// 等额本金法
    // ldcDkye: 贷款金额
    // ldcYll: 利率
    // aiReserveDkqx: 月数
    // adcYhk: 已还款金额
    // adcYhlx: 已还利息
    let ldcYhk = 0.00, ldcYhlx = 0.00;
    ldcYhlx =(mul(ldcDkye,ldcYll)).toFixed(2);
    ldcYhk = (div(ldcDkye,aiReserveDkqx)).toFixed(2);
    adcYhk.value = ldcYhk;
    adcYhlx.value = ldcYhlx;
    return (add(ldcYhk,ldcYhlx)).toFixed(2);
}
return {ComputerGr,Computer1,Computer3}
}