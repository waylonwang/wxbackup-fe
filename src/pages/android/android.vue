<template>
  <div>
    <h1>Android Assistant</h1>
    <div>
      <server-status-button
        @server-connected="onServerConnected"
        @server-disconnected="onServerDisconnected"
      ></server-status-button>
      <android-status-button
        ref="device_status"
        @android-connected="onDeviceConnected"
        @android-disconnected="onDeviceDisconnected"
      ></android-status-button>
      <root-status-button
        ref="root_status"
        v-show="this.$store.state.androidConnected"
        @android-rooted="onDeviceRooted"
        @android-unrooted="onDeviceUnrooted"
      ></root-status-button>
    </div>
    <el-row :gutter="20" class="input-header">
      <el-col :span="5">
        <hint-select
          ref="imei"
          defaultPlaceholder="IMEI"
          hintPlaceholder="Please choice IMEI..."
          v-model="imei"
        />
      </el-col>
      <el-col :span="5">
        <el-input ref="uin" placeholder="UIN" v-model="uin">
          <el-button slot="append" @click="getUin">Get</el-button>
        </el-input>
      </el-col>
      <el-col :span="5">
        <el-input
          ref="password"
          placeholder="Password"
          v-model="password"
          class="password"
          :readonly="true"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <hint-select
          ref="users"
          defaultPlaceholder="User"
          hintPlaceholder="Please choice User..."
          v-model="user"
        />
      </el-col>
      <el-col :span="3">
        <el-button
          type="primary"
          icon="el-icon-fa-plus"
          :disabled="!isInputReady"
          @click="createBackup"
        >Create Backup</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div v-for="output in outputs" :key="output[0]" :class="output[1]">
            <small>{{output[0]}}</small>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <project-browser ref="projects">
          <!-- <div v-for="output in outputs" :key="output[0]">{{output}}</div> -->
        </project-browser>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import ServerStatusButton from '@/components/status/server-status-button'
import AndroidStatusButton from '@/components/status/android-status-button'
import RootStatusButton from '@/components/status/root-status-button'
import HintSelect from '@/components/input/hint-select'
import ProjectBrowser from '@/components/common/project-browser'
import {
  Channel,
  Task,
  Command,
  onTaskResponse,
  sendOutput,
  OutputType
} from '@/components/server'

export default {
  name: 'Android',
  mixins: [Channel, Task, Command],
  components: {
    'server-status-button': ServerStatusButton,
    'android-status-button': AndroidStatusButton,
    'root-status-button': RootStatusButton,
    'hint-select': HintSelect,
    'project-browser': ProjectBrowser
  },
  computed: {
    password() {
      if (this.imei !== '' && this.uin !== '') {
        return CryptoJS.MD5(this.imei + this.uin)
          .toString()
          .substr(0, 7)
      } else {
        return ''
      }
    },
    uinUser() {
      if (this.uin !== '') {
        return CryptoJS.MD5('mm' + ~~parseInt(this.uin)).toString()
      } else {
        return ''
      }
    },
    isInputReady() {
      if (this.password !== '' && this.user !== '') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    uinUser(val) {
      this.user = val
    }
  },
  methods: {
    getImei() {
      this.execCommand({
        name: encodeURI('Get IMEI'),
        command: 'get_imei'
      })
    },
    getUin() {
      this.execCommand({
        name: encodeURI('Get UIN'),
        command: 'get_uin'
      })
    },
    getUser() {
      this.execCommand({
        name: encodeURI('Get Users'),
        command: 'get_users'
      })
    },

    startDeviceChecker() {
      this.addTask({
        name: encodeURI('Device checker'),
        category: 'heartbeat',
        params: {
          command: 'check_device',
          interval: 3
        }
      })
    },

    stopDeviceChecker() {
      this.killTask(encodeURI('Device checker'))
    },

    startRootChecker() {
      this.addTask({
        name: encodeURI('Root checker'),
        category: 'heartbeat',
        params: {
          command: 'check_root',
          interval: 3
        }
      })
    },

    stopRootChecker() {
      this.killTask(encodeURI('Root checker'))
    },

    createBackup() {
      this.$refs.projects.createProject(this.user, this.password)
    },

    onServerConnected() {
      this.$debug('android')
      // 服务连接时检查设备连接
      sendOutput(this, 'Server is connected', OutputType.SUCCESS)
      this.joinServerChannel()
      this.startDeviceChecker()
      this.addTask({
        name: encodeURI('Exist projects'),
        category: 'once',
        params: {
          command: 'get_exist_projects'
        }
      })
    },

    onServerDisconnected() {
      this.$debug('android')
      // 服务断开时关闭设备连接
      this.$refs.device_status.disconnectDevice()
    },

    onDeviceConnected() {
      this.$debug('android')
      // 设备连接时检查Root状态
      sendOutput(this, 'Device is connected', OutputType.SUCCESS)
      this.joinServerChannel()
      this.startRootChecker()
      // this.stopDeviceChecker()
    },

    onDeviceDisconnected() {
      this.$debug('android')
      // 设备断开时关闭Root状态
      // this.stopRootChecker()
      this.$refs.root_status.unrootDevice()
    },

    onDeviceRooted() {
      this.$debug('android')
      // 设备Root时提取输入字段
      this.getImei()
      this.getUin()
      this.getUser()
    },

    onDeviceUnrooted() {
      this.$debug('android')
      // 设备Unroot时清理输入字段
      this.$refs.imei.setMember([])
    },

    /**
     * 获取IMEI的前置响应
     * @param {any} data 响应数据
     * @returns
     */
    onPreCommandResponseGetImei(data) {
      let disabled = {}
      for (let imei of data) {
        disabled[imei] = true
      }
      this.$refs.imei.setMember(data, disabled)
    },
    /**
     * 获取IMEI的前置响应
     * @param {any} data 响应数据
     * @returns
     */
    onPreCommandResponseGetUin(data) {
      this.uin = data
    },
    /**
     * 获取IMEI的前置响应
     * @param {any} data 响应数据
     * @returns
     */
    onPreCommandResponseGetUsers(data) {
      let disabled = {}
      for (let user of data) {
        disabled[user] = user !== this.uinUser
      }
      this.$refs.users.setMember(data, disabled)
    }
  },
  sockets: {
    connect() {},
    disconnect() {},
    reconnect() {},
    taskResponse(data) {
      // 任务响应绑定本页方法
      onTaskResponse(this, data)
    }
  },
  data() {
    return {
      channel: 'android',
      outputs: [],
      imei: '',
      uin: '',
      user: ''
    }
  }
}
</script>

<style scoped>
h1 {
  margin: 0px 15px;
}
.input-header {
  margin-top: 10px;
  margin-bottom: 10px;
}
.password >>> .el-input__inner {
  background-color: #f5f7fa;
}
.el-card {
  border: none;
}
.el-card.is-always-shadow {
  -webkit-box-shadow: none;
  box-shadow: none;
}

.output-error {
  color: palevioletred;
  list-style-type: disc;
  /*font-size: 14px;*/
}

.output-stdout {
  color: dimgrey;
  list-style-type: disc;
  /*font-size: 14px;*/
}

.output-status {
  color: lightsteelblue;
  list-style-type: disc;
  /*font-size: 14px;*/
}

.output-success {
  color: limegreen;
  list-style-type: disc;
  /*font-size: 14px;*/
}

.output-error:before {
  content: 'ERROR';
  font-size: 9px;
  border-radius: 3px;
  border: 1px solid palevioletred;
  background-color: rgba(219, 112, 147, 0.2);
  color: palevioletred;
  opacity: 0.5;
  display: inline-block;
  text-align: center;
  width: 80px;
  margin: 5px 5px;
  padding: 0px 5px;
}

.output-stdout:before {
  content: 'OUTPUT';
  font-size: 9px;
  border-radius: 3px;
  border: 1px solid dimgrey;
  background-color: rgba(105, 105, 105, 0.2);
  color: dimgrey;
  opacity: 0.5;
  display: inline-block;
  text-align: center;
  width: 80px;
  margin: 5px 5px;
  padding: 0px 5px;
}

.output-status:before {
  content: 'COMMAND';
  font-size: 9px;
  border-radius: 3px;
  border: 1px solid lightsteelblue;
  background-color: rgba(176, 196, 222, 0.2);
  color: lightsteelblue;
  opacity: 0.5;
  display: inline-block;
  text-align: center;
  width: 80px;
  margin: 5px 5px;
  padding: 0px 5px;
}

.output-success:before {
  content: 'SUCCESS';
  font-size: 9px;
  border-radius: 3px;
  border: 1px solid limegreen;
  background-color: rgba(50, 205, 50, 0.2);
  color: limegreen;
  opacity: 0.5;
  display: inline-block;
  text-align: center;
  width: 80px;
  margin: 5px 5px;
  padding: 0px 5px;
}
</style>

