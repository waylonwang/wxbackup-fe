<template>
  <el-collapse v-model="activeProject" accordion>
    <el-collapse-item v-for="name in projectNames" :key="name" :name="name">
      <project-header
        slot="title"
        :time="projects[name].time"
        :password="projects[name].password"
        :user="projects[name].user"
      />
      <project-item
        v-for="type in ['En','De','Re']"
        :key="name + '_' + type"
        :type="type"
        :name="projects[name][type].label"
        :size="projects[name][type].size"
        :action="1"
        status="queue"
      />
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import ProjectHeader from './project-header'
import ProjectItem from './project-item'
import { Channel, Task, onTaskResponse } from '@/components/server'
import { generateProjectName } from '@/components/util'

export const FileType = {
  ENCRYPT: 'En',
  DECRYPT: 'De',
  RESOURCE: 'Re'
}

export default {
  name: 'ProjectBrowser',
  mixins: [Channel, Task],
  components: {
    'project-header': ProjectHeader,
    'project-item': ProjectItem
  },
  methods: {
    createProject(user, password) {
      let projectName = generateProjectName()
      this.setProject(projectName, user, password)
      this.sortProject()
      this.addTask({
        name: projectName,
        category: 'once',
        params: {
          command: 'create_project',
          user: user,
          password: password
        }
      })
      this.activeProject = projectName
    },
    setProject(projectName, user, password) {
      let p = projectName.split('_')
      this.projects[projectName] = {}
      this.projects[projectName]['name'] = projectName
      this.projects[projectName]['time'] =
        p[0].substr(0, 4) +
        '-' +
        p[0].substr(4, 2) +
        '-' +
        p[0].substr(6, 2) +
        ' ' +
        p[0].substr(8, 2) +
        ':' +
        p[0].substr(10, 2) +
        ':' +
        p[0].substr(12, 2)
      this.projects[projectName]['user'] = user
      this.projects[projectName]['password'] = password
      this.setFile(projectName, FileType.ENCRYPT, '', 0)
      this.setFile(projectName, FileType.DECRYPT, '', 0)
      this.setFile(projectName, FileType.RESOURCE, '', 0)
      if (!this.projectNames.includes(projectName)) {
        this.projectNames.push(projectName)
      }
    },
    sortProject() {
      this.projectNames.sort(function(a, b) {
        return a > b ? -1 : 1
      })
    },
    setFile(projectName, type, path, byte) {
      this.$debug('ProjectBrowser', projectName)
      this.projects[projectName][type] = {}
      this.projects[projectName][type]['label'] = {
        [FileType.ENCRYPT]: 'Encryption database',
        [FileType.DECRYPT]: 'Decryption database',
        [FileType.RESOURCE]: 'Resource'
      }[type]
      this.projects[projectName][type]['name'] = path.replace(/^.*[\\/]/, '')
      this.projects[projectName][type]['path'] = path
      this.projects[projectName][type]['byte'] = byte
      this.projects[projectName][type]['size'] =
        (byte === 0
          ? '0.00'
          : Number(
              (byte / 1024 / 1024).toString().match(/^\d+(?:\.\d{0,2})?/)
            )) + ' MB'
    },
    /**
     * 解析已有备份计划
     * @param data 备份列表数据
     * @returns {[]}
     */
    parseExistProjects(data) {
      for (let projectName in data) {
        this.setProject(
          projectName,
          data[projectName]['user'],
          data[projectName]['password']
        )
        for (let file of data[projectName]['files']) {
          this.setFile(
            projectName,
            file[0].replace(/^.*[\\/]/, '').substr(0, 2),
            file[0],
            file[1]
          )
        }
      }
      this.sortProject()
    },

    /**
     * 创建项目的前置响应
     * @param data 响应数据
     */
    onPreTaskResponseCreateProject(data) {
      if (data != null) {
        var projectName = data
        // backupFSM[projectName].waitPullDb()
      }
    },

    /**
     * 获取已存在项目的前置响应
     * @param data 响应数据
     */
    onPreTaskResponseGetExistProjects(data) {
      this.$debug('ProjectBrowser', data)
      // clearProjectBrowserContent()
      if (data !== null) {
        this.project = {}
        this.projectNames = []
        this.parseExistProjects(JSON.parse(data))
        this.activeProject = this.projectNames[0]
      }
      // updateProjectBrowserDisplay(true)
    }
  },
  sockets: {
    taskResponse(data) {
      // 任务响应绑定本页方法
      onTaskResponse(this, data)
    }
  },
  data() {
    return {
      channel: 'android',
      projectNames: [],
      projects: {},
      activeProject: ''
    }
  }
}
</script>

<style scoped>
.el-collapse-item >>> .el-collapse-item__header {
  background-color: #f5f7fa;
  height: 32px;
}
</style>
