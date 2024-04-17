<template>
  <div>
    <h1>贷款还款计划表</h1>
    <div>
      <label for="grzh">账号：</label>
      <input v-model="grzh" type="text" id="grzh" />
    </div>
    <div>
      <label for="grxm">姓名：</label>
      <input v-model="grxm" type="text" id="grxm" />
    </div>
    <div>
      <label for="sfzhm">身份证：</label>
      <input v-model="sfzhm" type="text" id="sfzhm" />
    </div>
    <div>
      <label for="dkje">贷款金额：</label>
      <input v-model="dkje" type="number" id="dkje" />
    </div>
    <div>
      <label for="bankJsfs">贷款方式：</label>
      <select v-model="bankJsfs" id="bankJsfs">
        <option value="固定还款日">固定还款日</option>
        <option value="固定还款日本金少">固定还款日本金少</option>
      </select>
    </div>
    <div>
      <label for="hkfs">还款方式：</label>
      <select v-model="hkfs" id="hkfs">
        <option :value="1">等额还款法</option>
        <option :value="3">等额本金法</option>
      </select>
    </div>
    <div>
      <label for="dkqx">贷款期限：</label>
      <input v-model="dkqx" type="number" id="dkqx" />
      <label for="dkNll">贷款利率：</label>
      <input v-model="dkNll" type="number"  id="dkNll" />
    </div>
    <button @click="generatePlan">生成还款计划</button>

    <table v-if="hkPlanData.length > 0">
      <thead>
        <tr>
          <th>期数</th>
          <th>还款日期</th>
          <th>分期还款额</th>
          <th>应还本金</th>
          <th>应还利息</th>
          <th>本金余额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in hkPlanData" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ row.DtHk.getFullYear() }}-{{ (row.DtHk.getMonth() + 1).toString().padStart(2, '0') }}-{{ row.DtHk.getDate().toString().padStart(2, '0') }}</td>
          <td>{{ row.dcBx }}</td>
          <td>{{ row.dcBj }}</td>
          <td>{{ row.dcLx }}</td>
          <td>{{ row.dcDkye }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import useplanData  from "./useplanData";
const {createGrHkPlanData,hkPlanData,asDkGrzh,asGrxm,asSfzhm,adcDkje,aiHkfs,aiDkqx,aiHkDay,adtDkFf,adcDkNll,lsBankJsfs,aiJsfs} = useplanData();
const grzh = ref('');
const grxm = ref('');
const sfzhm = ref('');
const dkje = ref(0);
const hkfs = ref(1);
const dkqx = ref(0);
const hkDay = ref(20);
const dkFf = ref(new Date('2023-01-12'));
const dkNll = ref(0);
const bankJsfs = ref('固定还款日');
const jsfs = ref(2);
const generatePlan = () => {
  asDkGrzh.value = grzh.value
  asGrxm.value = grxm.value
  asSfzhm.value = sfzhm.value
  adcDkje.value = dkje.value
  aiHkfs.value = hkfs.value;
  aiDkqx.value = dkqx.value;
  aiHkDay.value = hkDay.value;
  adtDkFf.value = dkFf.value;
  adcDkNll.value = dkNll.value;
  lsBankJsfs.value = bankJsfs.value;
  aiJsfs.value = jsfs.value; 
  createGrHkPlanData()
  };
</script>

