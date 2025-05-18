<template>
  <div class="app-container" style="max-width: 600px; margin: auto">
    <el-card>
      <div slot="header" class="clearfix">
        <span>设备报修</span>
      </div>

      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="设备名称" prop="deviceId" align="left">
          <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="choseDevice"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
            <el-pagination
              background
              layout="prev, pager, next, jumper"
              :page-size="devicePageSize"
              :current-page.sync="devicePageNum"
              :total="deviceTotal"
              @current-change="fetchData"
              style="margin-top: 10px"
            >
            </el-pagination>
          </el-select>
        </el-form-item>
        <el-form-item label="故障图片" align="left">
          <div>
            <el-upload
              class="avatar-uploader"
              action="#"
              ref="upload"
              :show-file-list="false"
              :on-change="handleAvatarChange"
              :auto-upload="false"
            >
              <img v-if="form.descImage" :src="form.descImage" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="故障描述" prop="description">
          <el-input
            type="textarea"
            v-model="form.description"
            placeholder="请详细描述设备故障情况"
            rows="4"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交报修</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getDeviceByCodeOrName } from "@/apis/device"; // 获取设备列表接口
import { createDeviceRepair } from "@/apis/device"; // 提交维修记录接口

export default {
  data() {
    return {
      devicePageNum: 1,
      devicePageSize: 10,
      deviceTotal: 0,
      options: [],
      value: [],
      loading: false,
      keyword: "",
      form: {
        deviceId: "",
        descImage: "",
        description: "",
      },
      rules: {
        deviceId: [
          { required: true, message: "请选择设备", trigger: "change" },
        ],
        description: [
          { required: true, message: "请输入故障描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    choseDevice(value) {
      console.log(value);
      this.form.deviceId = value;
    },
    remoteMethod(query) {
      this.keyword = query;
      this.loading = true;
      this.getDevice();
    },
    fetchData() {
      this.getDevice();
    },
    getDevice() {
      const params = {
        keyword: this.keyword,
        pageNum: this.devicePageNum,
        pageSize: this.devicePageSize,
      };
      getDeviceByCodeOrName(params)
        .then((res) => {
          if (res.data.code === 200) {
            res.data.data.list.forEach((item) => {
              item.label = item.deviceCode + "-" + item.deviceName;
            });
            this.options = res.data.data.list;
            this.deviceTotal = res.data.data.total;
            this.loading = false;
          } else {
            this.$message.error(res.data.message);
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleAvatarChange(file, fileList) {
      if (fileList.length > 1) fileList.shift();
      const isImage = file.raw.type.startsWith("image/");
      const isLt10M = file.raw.size / 1024 / 1024 < 10;
      if (!isImage) return this.$message.error("只能上传图片文件");
      if (!isLt10M) return this.$message.error("图片大小不能超过 10MB");
      const reader = new FileReader();
      reader.onload = (e) => {
        this.form.descImage = e.target.result;
      };
      reader.readAsDataURL(file.raw);
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const payload = {
          deviceId: this.form.deviceId,
          description: this.form.description,
          descImage: this.form.descImage,
        };
        createDeviceRepair(payload)
          .then((res) => {
            if (res.data.code === 200) {
              this.$message.success("报修提交成功");
              this.form= {
                deviceId: "",
                descImage: "",
                description: "",
              };
              this.value = [];
            } else {
              this.$message.error(res.data.msg || "提交失败");
            }
          })
          .catch(() => {
            this.$message.error("接口请求失败");
          });
      });
    },
  },
};
</script>

<style scoped>
.avatar-uploader {
  display: inline-block;
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  object-fit: cover;
  display: block;
}
</style>
