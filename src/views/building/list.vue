<template>
  <div class="app-container">
    <el-card>
      <!-- 表格 -->
      <el-table :data="buildingList" border style="width: 100%; margin-top: 20px;" height="500">
        <el-table-column prop="buildingNo" label="楼栋编号"/>
        <el-table-column prop="buildingName" label="楼栋名称"/>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark || '--' }}
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          style="margin-top: 20px; float: right; margin-bottom: 20px"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :current-page.sync="pageNum"
          @size-change="handleSizeChange"
          @current-change="getBuildingList"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getBuildingList} from '@/apis/building';

export default {
  data() {
    return {
      buildingList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.getBuildingList();
  },
  methods: {
    getBuildingList() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      getBuildingList(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data;
          this.buildingList = data.list;
          this.total = data.total;
        } else {
          this.$message.error(res.data.msg || '获取楼栋列表失败');
        }
      }).catch(err => {
        console.error(err);
        this.$message.error('接口请求失败');
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.getBuildingList();
    },
  }
};
</script>

<style scoped>
</style>
