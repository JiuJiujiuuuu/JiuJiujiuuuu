import useCommon from './useCommon';
import useComputerGr from './useComputerGr';
export default function () {
const { add, mul, div,getIntConfig,fIntCifang,yxRound,daysAfter,fMonthBetweenDates} = useCommon();
const {ComputerGr} = useComputerGr();
const GetTqHkPlanData = (asDkGrzh, aiYear, aiMonth, aiTqHkDay, adcTqhkJe, abOnlyTqhkbj, aiChangeDkqx, abComputeNextYhk) => {
    //asDkGrzh:贷款账号、aiYear：年份、aiMonth：月份、aiTqHkDay：提前还款日
    //adcTqhkJe：提前还款金额、aiChangeDkqx：是否改变贷款期限
    //abComputeNextYhk：是否计算下个月月还本金和利息
    //这个函数里一会用item.i_hk_day，一会用grhkData.i_hk_day，是为了实现省直贷款自主核算迁移过来的第一月的提前还款的利息按照实际天数来
    //abComputeNextYhk是否预测下个月的月还本金和利息，供界面使用
    let liLastYear = 0, liLastMonth = 0;
    if (aiMonth === 1) {
      liLastYear = aiYear - 1;
      liLastMonth = 12;
    } else {
      liLastMonth = aiMonth - 1;
      liLastYear = aiYear;
    }
    const liDkSfBili = getIntConfig(419, 6);
    let ldcYhDkbj = 0.00; //应还贷款本金
    let liYhDkMonths = 0;//已还款的月数
    let ldcTqBj = 0.00; //拖欠本金
    let ldcTqLx = 0.00; //拖欠利息
    let ldcTqBjYqlx = 0.00; //拖欠本金的逾期利息
    let ldcTqLxYqlx = 0.00; //拖欠利息的逾期利息
    let dataList = new TList();
    const YxndHkPlan = [];
    const VwYxndInfo = [];
    const NdHkgrPlan = [];
    const YxHuidan = [];

    let gdList = VwYxndInfo.filter(record => {
        return record.SGrzh === asDkGrzh && new Date(record.DtDk) < new Date(aiYear, aiMonth - 1, 1);
    });

    for (let i = 0; i < gdList.length; i++) {
      let item = gdList[i];
      ldcTqBj = 0.00; //拖欠本金
      ldcTqLx = 0.00; //拖欠利息
      ldcTqBjYqlx = 0.00; //拖欠本金的逾期利息
      ldcTqLxYqlx = 0.00; //拖欠利息的逾期利息

      //应收贷款合计
      let sumbj = YxndHkPlan.reduce((element, record) => {
        if (record.SGrzh === item.SGrzh && (record.IYear !== aiYear || record.IMonth !== aiMonth)) {
        return element + record.DcYsBj;
        } return element;
      }, 0);

      let newData = YxndHkPlan.find(record => {
        return record.IYear === aiYear && record.IMonth === aiMonth && record.SGrzh === asDkGrzh;
      });
      
      newData.DcNextBj = 0.00;
      newData.DcNextLx = 0.00;
      newData.DcNextBx = 0.00;

      ldcYhDkbj = sumbj;
      newData.DcReserveDkje = item.DcDkje - ldcYhDkbj;

      let count = YxndHkPlan.filter((record) => {
        return record.SGrzh === item.SGrzh && (record.IYear !== aiYear || record.IMonth !== aiMonth);
      });
      // 获取满足条件的数据条数
      liYhDkMonths = count.length;

      if (item.IDkqx === liYhDkMonths) continue;//期数已够,如果没有还清,需要走逾期处理途径
      newData.IReserveDkqx = item.IDkqx - liYhDkMonths;
      if (newData.SYhGrzh === null || newData.SYhGrzh.trim().length === 0) newData.SYhGrzh = '无';
      newData.IHkMonth = 1;
      newData.DcNll = item.DcNll;
      newData.DcDkye = item.DcDkye;

      let grhkData = NdHkgrPlan.find((record) =>{
        return record.SGrzh === item.SGrzh && record.IYear === aiYear && record.IMonth === aiMonth  ;
    });
 
      if (grhkData === null) {
            throw new Error('本月没有还款计划，可能是由于数据刚迁移过来的原因');
      }
      newData.DcYsBj = grhkData.DcBj;//要计算
      newData.DcYsLx = grhkData.DcLx;
      newData.DtLxJs = new Date(aiYear, aiMonth - 1, newData.IHkDay);
      newData.IYqQs = 1;
      newData.DcLjYsBj = 0.00;
      newData.DcLjYsLx = 0.00;
      newData.DcLjSsBj = 0.00;//累计实收本金0
      newData.DcLjSsLx = 0.00;//累计实收利息
      newData.DcLjSsFx = 0.00;//累计实收罚息
      newData.DcWthkJe = 0.00;
      newData.DcJe1 = 0.00;
      newData.DcJe2 = 0.00;
      newData.DcJe3 = 0.00;
      newData.DcJe4 = 0.00;
      newData.DcJe5 = 0.00;
      newData.DcJe6 = 0.00;
      
      let lastplandata = YxndHkPlan.find((record) => {
        return record.SGrzh === item.SGrzh && record.IYear === liLastYear && record.IMonth === liLastMonth;
      });

      if (lastplandata !== null) {
        //拖欠本金和利息
        if (lastplandata.DcTqhkBj === null) lastplandata.DcTqhkBj = 0.00;
        if (lastplandata.DcTqhkLx === null) lastplandata.DcTqhkLx = 0.00;
        ldcTqBj = lastplandata.DcQianBj + lastplandata.DcYsBj + lastplandata.DcTqhkBj - lastplandata.DcSsBj;
        ldcTqLx = lastplandata.DcQianLx + lastplandata.DcYsLx + lastplandata.DcTqhkLx - lastplandata.DcSsLx;
        if (lastplandata.DcSsFx === lastplandata.DcQianBjYqlx + lastplandata.DcQianLxYqlx) {
            ldcTqBjYqlx = 0.00;
            ldcTqLxYqlx = 0.00;//拖欠利息的逾期利息
        } else {
            if (lastplandata.DcSsFx >= lastplandata.DcQianLxYqlx) {
                ldcTqLxYqlx = 0.00;//拖欠利息的逾期利息
                ldcTqBjYqlx = lastplandata.DcQianBjYqlx + lastplandata.DcQianLxYqlx - lastplandata.DcSsFx;
            } else {//利息和本金的逾期利息都拖欠
                ldcTqLxYqlx = lastplandata.DcQianLxYqlx - lastplandata.DcSsFx;//拖欠利息的逾期利息
                ldcTqBjYqlx = lastplandata.DcQianBjYqlx;
            }
        }
        //从软件的界面上控制他的当月的第二次提前还款
        if (newData.DcQianBjYqlx + newData.DcQianLxYqlx - newData.DcSsFx <= 0.00) {//这是本次的第二次提前还款，前面的拖欠罚息已清
          newData.DcQianBj = newData.DcQianBj - newData.DcSsBj;//减去本次的拖欠本金罚息。
          newData.DcQianLx = newData.DcQianLx - newData.DcSsLx;//减去本次的拖欠利息罚息。
          newData.DcQianBjYqlx = 0.00;//将拖欠的本金逾期利息置零
          newData.DcQianLxYqlx = 0.00;//将拖欠的利息逾期利息置零。
          if (newData.DcQianBj < 0.00) newData.DcQianBj = 0.00;
          if (newData.DcQianLx < 0.00) newData.DcQianLx = 0.00;
        } else {
          newData.DcQianBjYqlx = yxRound(ldcTqBjYqlx + mul(div(div(mul( mul(ldcTqBj,newData.DcNll), div (add(1,div(liDkSfBili,100)))),100) ,360 ) ,30), 2);
          if (getIntConfig(419, 5) === 2) {//本金单利利息复利
            let ldcCifang = fIntCifang(1 + newData.DcNll *div(add(1,div(liDkSfBili,100)),360), daysAfter(lastplandata.DtLxJs, newData.DtLxJs));
            //本次拖欠的利息部分的逾期利息
            newData.DcQianLxYqlx = yxRound(ldcTqLx * ldcCifang, 2);}
            else //单利
            {
                newData.DcQianLxYqlx = yxRound(mul(div(div(mul( mul(ldcTqLx,newData.DcNll), div (add(1,div(liDkSfBili,100)))),100) ,360 ) ,30), 2);
            }
            newData.DcQianLxYqlx = ldcTqLxYqlx + newData.DcQianLxYqlx;
            if (newData.DcQianBjYqlx < 0.00) newData.DcQianBjYqlx = 0.00;
            if (newData.DcQianLxYqlx < 0.00) newData.DcQianLxYqlx = 0.00;
        }
        newData.IYqQs = lastplandata.IYqQs + 1;
        newData.DcLjYsBj = lastplandata.DcLjYsBj + newData.DcYsBj;
        newData.DcLjYsLx = lastplandata.DcLjYsLx + newData.DcYsLx;
        newData.DcLjSsBj = lastplandata.DcLjSsBj; //累计实收本金0
        newData.DcLjSsLx = lastplandata.DcLjSsLx; //累计实收利息
        newData.DcLjSsFx = lastplandata.DcLjSsFx; //累计实收罚息
        }
        else {
            newData.DcLjYsBj = newData.DcYsBj;
            newData.DcLjYsLx = newData.DcYsLx;
        }
        //本月逾期
        newData.DcYqBj = newData.DcQianBj + newData.DcYsBj - newData.DcSsBj;
        newData.DcYqLx = newData.DcQianLx + newData.DcYsLx - newData.DcSsLx;
        newData.DcYqFx = newData.DcQianBjYqlx + newData.DcQianLxYqlx - newData.DcSsFx;
        newData.SSkGrzh = item.SHdcxzh;//将客户的核定储蓄账号, 赋给 newData 对象的 SSkGrzh 字段，表示客户的授信储蓄账号。
        newData.SSkZhmc = item.SHdcxxm;//核定储蓄姓名
        newData.SChyhdm = item.SChyhdm;//存款银行代码,
        newData.SHdcxyhmc = item.SHdcxyhmc;//客户的核定储蓄银行名称
        if (newData.SSkGrzh == null) newData.SSkGrzh = " ";
        if (newData.SSkZhmc == null) newData.SSkZhmc = " ";
        
        newData.DcTqhkLx = 0.00;
        if (abOnlyTqhkbj) //直接传入的是提前还款本金
        {
            if (aiTqHkDay < item.IHkDay) {
                let liSzFirstHkDay = grhkData.IHkDay;
                if (aiMonth - 1 === 4 || aiMonth - 1 === 6 || aiMonth - 1 === 9 || aiMonth - 1 === 11) {
                    if (grhkData.IHkDay === 31) liSzFirstHkDay = 30;
                }
                if (aiMonth - 1 === 2) {
                    if (grhkData.IHkDay > 28) liSzFirstHkDay = 28;
                }
                let ldtLastHkDate;
                if (aiMonth === 1) ldtLastHkDate = new Date(aiYear - 1, 11, liSzFirstHkDay);
                else ldtLastHkDate = new Date(aiYear, aiMonth - 2, liSzFirstHkDay);
                let ldcTqhkDkye = grhkData.DcDkye + grhkData.DcBj;
                //如果是本月第二次提前还款
                if (newData.DcTqhkBj > 0.00) {

                    let tqhkhdList = YxHuidan.filter(record =>{
                        return (
                            record.IYear === aiYear.toString() &&
                            record.IMonth === aiMonth.toString() &&
                            record.SDwzh === item.SGrzh &&
                            record.IFlag === "3" &&
                            ["58", "1015", "1018"].includes(record.IOp)
                        );
                      });
                    ldtLastHkDate = new Date(Math.max(...tqhkhdList.map(p => new Date(p.DtKxfs))));
                    ldcTqhkDkye = ldcTqhkDkye - newData.DcTqhkBj - grhkData.DcBj;
                }
                let liDays1 = 11;
                if (grhkData.IHkDay === 15) liDays1 = 16;
                //年度利率调整的提前还款
                if (aiYear === 2023 && aiMonth === 1 && newData.DcTqhkBj === 0.00) {
                    let ldcOldNll = 3.25;
                    if (grhkData.DcNll === 2.6) ldcOldNll = 2.75;
                    newData.DcYsLx = yxRound( mul(mul(ldcTqhkDkye,liDays1) ,div(div(ldcOldNll,100) ),360) , 2) + yxRound(mul(mul(ldcTqhkDkye,aiTqHkDay) ,div(div(grhkData.DcNll,100) ,360) ), 2);
                } else {
                    newData.DcYsLx = yxRound( div(div(mul(ldcTqhkDkye,grhkData.DcNll) ,360 ),100) * daysAfter(ldtLastHkDate, new Date(aiYear, aiMonth-1, aiTqHkDay)), 2);
                }
            }

            if (aiTqHkDay > item.IHkDay) {
                // 需要判断在20日的还款是否记账了，如果有拖欠款怎么办
                let ldtHkDate = new Date(aiYear, aiMonth - 1, item.IHkDay);
                // 如果是本月第二次提前还款
                if (newData.DcTqhkBj > 0.00) {

                    let tqhkhdList = YxHuidan.filter(record => {
                        return (
                            record.IYear === aiYear.toString() &&
                            record.IMonth === aiMonth.toString() &&
                            record.SDwzh === item.SGrzh &&
                            record.IFlag === "3" &&
                            ["58", "1015", "1018"].includes(record.IOp)
                        );
                    });

                    let maxDate = new Date(Math.max(...tqhkhdList.map(p => new Date(p.DtKxfs))));
                    ldtMaxTqHkDate = maxDate.getDate();
                    if (ldtHkDate.getDate() < ldtMaxTqHkDate) {
                        ldtHkDate = maxDate;
                    }
                }
                // 大于还款日
                newData.DcTqhkLx = yxRound( mul(item.DcDkye, div(div(grhkData.DcNll,360) ,100) ) * daysAfter(ldtHkDate, new Date(aiYear, aiMonth - 1, aiTqHkDay)), 2);
            }
            //本月第二次提前还款
            if (newData.DcTqhkBj > 0.00) {
                newData.DcYsBj = 0.00;
            }
            newData.DcTqhkBj = adcTqhkJe - newData.DcYsBj - newData.DcQianBj;
        
            if (item.DcDkye === adcTqhkJe) {//刚好还清
                newData.DcNextBj = 0.00;
                newData.DcNextLx = 0.00;
                newData.DcNextBx = 0.00;
            } else {
                let ldcYhk = 0.00;
                let ldcYhlx = 0.00;
                let dkywdata = NdGrdkyw.find((record)=>{
                    return record.SGrzh === item.SGrzh ;
                });
                let liReserveDkqx = item.IDkqx - fMonthBetweenDates(dkywdata.DtBankDkff, new Date(aiYear, aiMonth-1, aiTqHkDay)) - aiChangeDkqx;
            
            if (liReserveDkqx === 0) {
                newData.DcNextBj = 0.00;
                newData.DcNextLx = 0.00;
                newData.DcNextBx = 0.00;
            } else {
                ComputerGr(liReserveDkqx, item.DcDkye - adcTqhkJe, item.DcNll / 100, item.IHkfs, 2, ldcYhk, ldcYhlx);
                //保存重新计算还款计划后的下个月的应还本金和利息
                newData.DcNextBj = ldcYhk;
                newData.DcNextLx = ldcYhlx;
                newData.DcNextBx = ldcYhk + ldcYhlx;
                }
            }   
        }
        else{
            throw new Error("直接传入的是提前还款后的本次本息合计，这个条件不会有效");
        }
    
       if (!abComputeNextYhk) {
            newData.DcNextBj = 0.00;
            newData.DcNextLx = 0.00;
            newData.DcNextBx = 0.00;
        }
        
        dataList.push(newData);
    }
    
    if (dataList.length > 0) {
        return dataList[0];
    } else {
        let tdata = new YxndHkPlan();
        tdata.IYear = 0;
        tdata.IMonth = 0;
        tdata.DcDkye = 0.00;
        tdata.SDkGrzh = asDkGrzh;
        tdata.DcTqhkLx = 0.00;
        return tdata;
    }
}
return {GetTqHkPlanData}
}
