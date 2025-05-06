<template>
  <div class="app-container">
    <el-card>
      <div style="display: flex; justify-content: space-between">
        <div style="display: flex;flex-wrap: wrap;gap: 15px 20px">
          <el-input
              placeholder="请输入教室名称"
              style="width: 200px; "
              size="small"
              v-model="searchFields.classroomName"
          ></el-input>
          <!--        筛选楼栋-->
          <el-select
              placeholder="选择楼栋"
              style="width: 120px; "
              size="small"
              v-model="searchFields.building"
          >
            <el-option
                v-for="building in buildingList"
                :key="building.id"
                :label="building.buildingName"
                :value="building.id"
            ></el-option>
          </el-select>
          <!--        状态 空闲/使用中/预约中/维修中-->
          <el-select
              placeholder="选择状态"
              style="width: 120px; "
              size="small"
              v-model="searchFields.status"
          >
            <el-option
                v-for="status in statusList"
                :key="status.value"
                :label="status.label"
                :value="status.value"
            ></el-option>
          </el-select>
          <!--        用途 自习/教学/会议/考试-->
          <el-select
              placeholder="选择用途"
              style="width: 120px; "
              size="small"
              v-model="searchFields.type"
          >
            <el-option
                v-for="type in typeList"
                :key="type.value"
                :label="type.label"
                :value="type.value"
            ></el-option>
          </el-select>
          <div>
            <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="getClassroomList()"
            >查询
            </el-button
            >
            <el-button
                icon="el-icon-refresh"
                size="small"
                @click="resetSearchFields()"
            >重置
            </el-button
            >
          </div>
        </div>
        <div>
          <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="handleDeleteBatch"
          >批量删除
          </el-button
          >
          <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              @click="addClassroomDialog = true"
          >新增教室
          </el-button
          >
        </div>
      </div>
      <el-table
          :data="classroomList"
          style="width: 100%; margin-top: 20px"
          height="520"
          border
          @selection-change="handleSelectionChange"
          @select="handleSelect"
          @select-all="handleSelectAll"
      >
        <el-table-column
            type="selection"
            width="55"
            align="center"
            fixed="left"
        ></el-table-column>
        <el-table-column prop="classroomCode" label="教室编号" width="120"/>
        <el-table-column prop="classroomName" label="教室名称"/>
        <el-table-column prop="buildingName" label="楼栋"/>
        <el-table-column prop="floor" label="楼层"/>
        <el-table-column prop="capacity" label="容量"/>
        <el-table-column prop="type" label="用途"/>
        <el-table-column prop="status" label="状态"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center;">
              <el-button size="mini" @click="handleDetail(scope.row)" type="text" style="color: #409eff">详情
              </el-button>
              <el-button size="mini" @click="handleEdit(scope.row)" type="text" style="color: #f4b03e">编辑</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.row)" style="color: #f56c6c">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          style="margin-top: 20px; float: right; margin-bottom: 20px"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :current-page.sync="pageNum"
          @size-change="handleSizeChange"
          @current-change="getClassroomList()"
      ></el-pagination>
      <el-dialog
          title="新增教室"
          :visible.sync="addClassroomDialog"
          width="500px"
          center
      >
        <el-form
            ref="form"
            :model="newClassroom"
            :rules="rules"
            label-width="100px"
            label-position="left"
            style="padding: 20px"
        >
          <el-form-item label="教室编号" prop="classroomCode">
            <el-input
                v-model="newClassroom.classroomCode"
                style="width: 100%"
                placeholder="请输入教室编号(如A101)"
            ></el-input>
          </el-form-item>
          <el-form-item label="教室名称">
            <el-input
                v-model="newClassroom.classroomName"
                style="width: 100%"
                placeholder="请输入教室名称(未填则自动生成)"
            ></el-input>
          </el-form-item>
          <el-form-item label="容量" prop="capacity">
            <el-input
                v-model.number="newClassroom.capacity"
                style="width: 100%"
                placeholder="请输入容量"
            ></el-input>
          </el-form-item>
          <el-form-item label="用途" prop="type">
            <el-select
                v-model="newClassroom.type"
                placeholder="请选择用途"
                style="width: 100%"
            >
              <el-option
                  v-for="type in typeList"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
          title="编辑教室"
          :visible.sync="editClassroomDialog"
          width="500px"
          center
      >
        <el-form
            ref="editForm"
            :model="editClassroom"
            :rules="rules"
            label-width="100px"
            label-position="left"
            style="padding: 20px"
        >
          <el-form-item label="教室编号" prop="classroomCode">
            <el-input
                v-model="editClassroom.classroomCode"
                style="width: 100%"
                :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="教室名称">
            <el-input
                v-model="editClassroom.classroomName"
                style="width: 100%"
                placeholder="请输入教室名称(未填则自动生成)"
            ></el-input>
          </el-form-item>
          <el-form-item label="容量" prop="capacity">
            <el-input
                v-model.number="editClassroom.capacity"
                style="width: 100%"
                placeholder="请输入容量"
            ></el-input>
          </el-form-item>
          <el-form-item label="用途" prop="type">
            <el-select
                v-model="editClassroom.type"
                placeholder="请选择用途"
                style="width: 100%"
            >
              <el-option
                  v-for="type in typeList"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
                v-model="editClassroom.status"
                placeholder="请选择状态"
                style="width: 100%"
            >
              <el-option
                  v-for="status in statusList"
                  :key="status.value"
                  :label="status.label"
                  :value="status.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editClassroomDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitEditForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getClassroomList,
  addClassroom,
  updateClassroom,
  deleteClassroom,
  deleteClassroomBatch,
} from "@/apis/classroom";
import {getAllBuilding} from "@/apis/building"; // 假设有一个获取所有楼栋的接口

export default {
  data() {
    return {
      addClassroomDialog: false,
      classroomList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      searchFields: {
        classroomName: "",
        building: "",
        status: "",
        type: "",
      },
      buildingList: [],
      statusList: [
        {label: "空闲", value: "空闲"},
        {label: "使用中", value: "使用中"},
        {label: "预约中", value: "预约中"},
        {label: "维修中", value: "维修中"},
      ],
      // 自习，教学，会议，考试
      typeList: [
        {label: "自习", value: "自习"},
        {label: "教学", value: "教学"},
        {label: "会议", value: "会议"},
        {label: "考试", value: "考试"},
      ],
      newClassroom: {
        classroomCode: "",
        classroomName: "",
        capacity: null,
        type: "",
      },
      selectedIds: [],
      rules: {
        classroomCode: [
          {
            required: true,
            message: "请输入教室编号",
            trigger: "blur",
          },
          {
            pattern: /^[A-Z][0-9]{3,4}$/,
            message: "教室编号格式错误，格式应为如 A101、B205、C1205",
            trigger: "blur",
          },
        ],
        capacity: [
          {
            required: true,
            message: "请输入容量",
            trigger: "blur",
          },
          {
            min: 1,
            type: "number",
            message: "容量必须大于0",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择用途",
            trigger: "change",
          },
        ],
      },
      editClassroom: {},
      editClassroomDialog: false,
    };
  },

  created() {
    this.getClassroomList();
    this.getAllBuilding();
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
      this.addClassroomDialog = false;
    },
    handleSelect(selection) {
      console.log(selection);
      this.selectedIds = selection.map((item) => item.id);
    },
    handleSelectAll(selection) {
      if (selection.length === this.classroomList.length) {
        this.selectedIds = this.classroomList.map((item) => item.id);
      } else {
        this.selectedIds = [];
      }
    },
    handleDeleteBatch() {
      if (this.selectedIds.length === 0) {
        this.$message.warning("请选择要删除的教室");
        return;
      }
      this.$confirm("确认删除选中的教室吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            // 批量删除
            console.log(this.selectedIds);
            deleteClassroomBatch({ids: this.selectedIds}).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("删除成功");
                this.getClassroomList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
          });
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.pageNum = 1;
      this.getClassroomList();
    },
    getClassroomList() {
      var params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        classroomName: this.searchFields.classroomName,
        building: this.searchFields.building,
        status: this.searchFields.status,
        type: this.searchFields.type,
      };
      getClassroomList(params)
          .then((res) => {
            console.log("获取教室列表成功", res);
            if (res.data.code === 200) {
              this.classroomList = res.data.data.list;
              this.total = res.data.data.total;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => {
            console.error(err);
            this.$message.error("获取教室列表失败");
          });
    },
    getAllBuilding() {
      // 获取所有楼栋
      getAllBuilding()
          .then((res) => {
            console.log("获取所有楼栋成功", res);
            if (res.data.code === 200) {
              this.buildingList = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => {
            console.error(err);
          });
    },
    resetSearchFields() {
      this.searchFields.classroomName = "";
      this.searchFields.building = "";
      this.searchFields.status = "";
      this.searchFields.type = "";
      this.pageNum = 1;
      this.pageSize = 10;
      this.getClassroomList();
    },
    handleEdit(row) {
      this.editClassroom = {...row};
      this.editClassroomDialog = true;
      this.$refs.editForm.clearValidate();
    },
    handleDelete(row) {
      this.$confirm(`确认删除教室 ${row.classroomName} 吗？`, "提示", {
        type: "warning",
      })
          .then(() => {
            deleteClassroom({id: row.id}).then((res) => {
              if (res.data.code === 200) {
                this.$message.success("删除成功");
                this.getClassroomList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
          })
          .catch(() => {
          });
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addClassroom(this.newClassroom)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message.success("新增成功");
                  this.addClassroomDialog = false;
                  this.getClassroomList();
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("新增失败");
              });
        } else {
          this.$message.warning("请填写完整信息");
        }
      });
    },
    submitEditForm() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          updateClassroom(this.editClassroom)
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message.success("编辑成功");
                  this.editClassroomDialog = false;
                  this.getClassroomList();
                } else {
                  this.$message.error(res.data.msg);
                }
              })
              .catch((err) => {
                console.error(err);
                this.$message.error("编辑失败");
              });
        } else {
          this.$message.warning("请填写完整信息");
        }
      });
    },
  },
};
</script>
